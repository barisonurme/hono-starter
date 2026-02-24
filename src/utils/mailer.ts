import nodemailer from "nodemailer";

import env from "@/core/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: `"${env.JWT_ISSUER}" <${env.GMAIL_USER}>`,
    ...options,
  });
}
