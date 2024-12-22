import nodemailer from "nodemailer";

export async function sendOtpEmail({ email, otp, token }) {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "poojanpatel2121@gmail.com", // Use your Gmail address here
        pass: process.env.GMAIL_SECRET, // Use the app password you generated
      },
    });

    // Set up email data
    const mailOptions = {
      from: "poojanpatel2121@gmail.com", // Sender's email
      to: email, // Recipient's email
      subject: "Your OTP Code", // Subject
      text: `Your OTP code is ${otp}.`, // Plain text body
      html: `<p>Your OTP code is <strong>${otp}</strong>.<br><a href="http://localhost:3000/verifyOtp/${token}">Click here</a> to verify.</p>`, // HTML body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(email);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
