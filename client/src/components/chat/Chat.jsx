import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats, onDeleteChat }) {
  const [chat, setChat] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const navigate = useNavigate();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest(`/chats/${id}`);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }

      setChat({ ...res.data, receiver });
      setActiveChatId(id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put(`/chats/read/${chat.id}`);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });

      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));

      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteChat = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?",
    );
    if (confirmed) {
      try {
        await apiRequest.delete(`/chats/${chat.id}`); // Use chat.id instead of id

        // Clear the current chat and active chat ID
        setChat(null);
        setActiveChatId(null);
        navigate("/profile");
      } catch (err) {
        console.log("Error deleting chat:", err);
      }
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || activeChatId === c.id
                  ? "white"
                  : "var(--primary-color)",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.png"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.png"} alt="" />
              {chat.receiver.username}
            </div>
            <button className="deleteChatButton" onClick={handleDeleteChat}>
              Delete Chat
            </button>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
