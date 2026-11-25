
import nodemailer from "nodemailer";

export const sendResetEmail = async (email, resetURL) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();

  const info = await transporter.sendMail({
    from: `"RealEstate Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>

      <p>Click below to reset your password.</p>

      <a href="${resetURL}">Reset Password</a>

      <p>This link expires in 15 minutes.</p>
    `,
  });

  console.log("Email sent:", info.messageId);
};
