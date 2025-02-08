import nodemailer from "nodemailer";

export async function sendOtpEmail({ email, otp, token, type }) {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "poojanpatel2121@gmail.com", // Use your Gmail address here
        pass: process.env.GMAIL_SECRET, // Use the app password you generated
      },
    });

    // Set up email content based on type
    let subject, htmlContent;

    if (type === "forgotPass") {
      subject = "Password Reset Request";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4A90E2; text-align: center;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the OTP below to reset it:</p>
            <p style="font-size: 24px; color: #4A90E2; text-align: center; font-weight: bold;">${otp}</p>
            <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000/resetPassword/${token}" style="background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
          </div>
        </div>
      `;
    } else {
      subject = "Your OTP Code";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4A90E2; text-align: center;">Your OTP Code</h2>
            <p style="font-size: 16px; color: #333;">Use the OTP below to verify your account:</p>
            <p style="font-size: 24px; color: #4A90E2; text-align: center; font-weight: bold;">${otp}</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000/verifyOtp/${token}" style="background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify OTP</a>
            </div>
          </div>
        </div>
      `;
    }

    // Set up email data
    const mailOptions = {
      from: "poojanpatel2121@gmail.com", // Sender's email
      to: email, // Recipient's email
      subject: subject, // Dynamic subject
      text: `Your OTP code is ${otp}.`, // Plain text body for fallback
      html: htmlContent, // Dynamic HTML body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
