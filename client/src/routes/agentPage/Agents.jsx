import React, { useState } from "react";
import "./Agents.scss";
import agentsData from "./agentData"; // Adjust the path as necessary

const Agent = ({ agent }) => (
  <div className="agent">
    <img src={agent.imageUrl} alt={agent.name} />
    <h2>{agent.name}</h2>
    <p>{agent.address}</p>
    <p>Rating: {agent.rating}</p>
    <p>Reviews: {agent.reviews}</p>
    <p>Listings: {agent.listings}</p>
    <p>Areas: {agent.areas.join(", ")}</p>
    <p>Services: {agent.services.join(", ")}</p>
  </div>
);

const AgentsPage = () => {
  const [filter, setFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const applyFilter = () => {
    setAppliedFilter(filter);
  };

  const filteredAgents = agentsData.filter(
    (agent) =>
      agent.name.toLowerCase().includes(appliedFilter) ||
      agent.areas.some((area) => area.toLowerCase().includes(appliedFilter)),
  );

  return (
    <div className="agents-page">
      <header>
        <h1>Meet Our Agents</h1>
        <p>
          Our team of experienced real estate agents is here to help you find
          your dream property.
        </p>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Filter by name or area..."
            value={filter}
            onChange={handleFilterChange}
          />
          <button className="filter-button" onClick={applyFilter}>
            Apply Filter
          </button>
        </div>
      </header>
      <section className="agent-profiles">
        {filteredAgents.map((agent) => (
          <Agent key={agent.id} agent={agent} />
        ))}
      </section>
      <footer>
        <p>&copy; 2025 EzyHomes. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AgentsPage;
