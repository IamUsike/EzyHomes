import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      username: user.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

export const generateRefreshToken = (user) => {
  return (
    jwt.sign({
      _id: user.id,
      username: user.username,
    }),
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

import { Resend } from "resend";
export const sendVerificationMail = async (userEmail, userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.EMAIL_SECRET, {
      expiresIn: "15m",
    });
    console.log(token);
    const verificationLink = `${process.env.API_URL}/auth/verify-email?token=${token}`;
    const resend = new Resend(process.env.RESEND_API);

    const result = await resend.emails.send({
      from: "theDreamDwellsupport <noreply@thedreamdwell.shop>",
      to: userEmail,
      subject: "Verify your Email for DreamDwell registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to theDreamDwell!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
          </div>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't create an account with theDreamDwell, please ignore this email.</p>
        </div>
      `,
    });

    console.log(result);
    return { success: true, messageId: result.data["id"] };
  } catch (err) {
    console.error(`Error while sending mail: ${err.message}`);
    return { success: false, error: err.message };
  }
};

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    console.log(decoded);

    await prisma.user.update({
      where: { id: decoded?.id },
      data: { verified: true },
    });

    const verifiedUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        verified: true,
      },
    });

    if (!verifiedUser || !verifiedUser.verified) {
      return res.status(500).json({ message: "Failed to verify email" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, verifiedUser, "Email verified Successfully"));
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Token has expired. Request a new verification token",
      });
    }

    return res.status(400).json({ message: "Invalid Token" });
  }
});
