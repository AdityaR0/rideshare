const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

const sendOTPEmail = async (email, otp) => {
  // Check SMTP connection
  await transporter.verify();
  console.log("✅ SMTP Connected Successfully");

  await transporter.sendMail({
    from: `"RideShare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "RideShare Community Verification OTP",
    html: `
      <h2>RideShare Community Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  });
};

module.exports = sendOTPEmail;
