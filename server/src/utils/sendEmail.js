const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true only for port 465

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
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
