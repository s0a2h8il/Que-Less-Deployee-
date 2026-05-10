import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

/** App passwords and secrets pasted from UI often include spaces — Gmail rejects those. */
const normalizeSecret = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, "").trim() : value;

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = normalizeSecret(process.env.SMTP_PASS);
  const host = (process.env.SMTP_HOST || "").toLowerCase();
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;

  const useGmailBuiltin =
    process.env.SMTP_SERVICE === "gmail" ||
    !host ||
    host === "smtp.gmail.com";

  if (useGmailBuiltin) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user, pass },
    family: 4,
  });
}

const sendEmail = async (options) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("\n=======================================================");
      console.log("⚠️  MOCK EMAIL SENT (No SMTP Credentials Configured) ⚠️");
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message HTML:\n${options.message}`);
      console.log("=======================================================\n");
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `Que-Less <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log("✉️ Email sent successfully to:", options.email);
  } catch (error) {
    const code = error.code || error.responseCode;
    const reason = error.response ?? error.message;
    console.error("❌ Email could not be sent:", { code, reason, response: error.response });
    throw new ApiError(
      500,
      `There was an error sending the email. Try again later!${code ? ` [${code}]` : ""}`,
    );
  }
};

export default sendEmail;
