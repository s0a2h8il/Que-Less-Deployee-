import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const sendEmail = async (options) => {
  try {
    // If no SMTP credentials are provided, mock the email send for local testing
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("\n=======================================================");
      console.log("⚠️  MOCK EMAIL SENT (No SMTP Credentials Configured) ⚠️");
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message HTML:\n${options.message}`);
      console.log("=======================================================\n");
      return; // Successfully "sent"
    }

    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `Que-Less <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
    console.log("✉️ Email sent successfully to:", options.email);
  } catch (error) {
    console.error("❌ Email could not be sent:", error);
    throw new ApiError(500, "There was an error sending the email. Try again later!");
  }
};

export default sendEmail;
