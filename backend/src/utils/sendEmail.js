import nodemailer from "nodemailer";
import { Resend } from "resend";
import { ApiError } from "./ApiError.js";

/** App passwords and secrets pasted from UI often include spaces — Gmail rejects those. */
const normalizeSecret = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, "").trim() : value;

/**
 * Log once at startup so production logs show whether OTP emails can actually send.
 */
export function logEmailStartup() {
  if (process.env.RESEND_API_KEY) {
    console.log("✉️  [Email] Using Resend API (HTTPS — recommended on Render)");
    return;
  }
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log(
      "✉️  [Email] Using SMTP (" +
        (process.env.SMTP_HOST || "smtp.gmail.com (default)") +
        ") — if OTP never arrives, add RESEND_API_KEY instead",
    );
    return;
  }
  console.warn(
    "⚠️  [Email] No RESEND_API_KEY or SMTP credentials — OTP is logged to console only (mock).",
  );
}

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

async function sendViaResend(options) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM?.trim() ||
    "QueueLess <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: [options.email],
    subject: options.subject,
    html: options.message,
  });

  if (error) {
    console.error("❌ Resend API error:", error);
    const msg = error.message || JSON.stringify(error);
    throw new ApiError(500, `Email send failed (Resend): ${msg}`);
  }

  console.log("✉️ Email sent via Resend to:", options.email, data?.id ? `(id ${data.id})` : "");
}

async function sendViaSmtp(options) {
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
  await transporter.sendMail({
    from: `Que-Less <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  });
  console.log("✉️ Email sent successfully to:", options.email);
}

const sendEmail = async (options) => {
  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(options);
      return;
    }
    await sendViaSmtp(options);
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
