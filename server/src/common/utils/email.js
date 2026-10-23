import nodemailer from "nodemailer";

/**
 * nodemailer is a third party library for Node.js app -
 * that communicate with SMTP servers(Gmail,yahoo, mailtrap) and send emails
 *
 *
 * SMTP transporter — works with Mailtrap, Gmail, SendGrid, or any SMTP provider
 *
 */

const transporter = nodemailer.createTransport({
  // createTransport: return a transporter instance

  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Before sending emails, you can verify that Nodemailer can connect to your SMTP server.
 * This is useful for catching configuration errors early.
 *
 */

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}

/**
 
  try {
  const info = await transporter.sendMail({
    from: '"Example Team" <team@example.com>', // sender address
    to: "alice@example.com, bob@example.com", // list of recipients
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
 
 */

//send email
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
      to, // list of recipients
      subject, // subject line
      html, // HTML body
    });

    // console.log("Message sent: %s", info);
    //This will notify that email has been sent successfully
    console.log("Info result: ", info);
    //specific id corresponding to the email
    console.log("Info result: ", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error while sending mail:", error);
    throw error;
  }
};

//send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendEmail(
      email,
      "Verify your email",
      `<h2>Welcome!</h2>
      <p>Click 
      <a href="${url}">here</a>
       to verify your email.
       </p>
      `,
    );
  } catch (error) {
    console.error("Error while sending mail:", error);
    throw error;
  }
};

//send reset password email
const sendResetPasswordEmail = async (email, token) => {
  try {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      email,
      "Reset your password",
      `<h2>Password reset!</h2>
      <p>Click 
      <a href="${url}">here</a>
       to reset your password.
       This link will expire in 15 minutes
       </p>
      `,
    );
  } catch (error) {
    console.error("Error while sending mail:", error);
    throw error;
  }
};

export { sendVerificationEmail, sendResetPasswordEmail };
