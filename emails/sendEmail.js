import { Resend } from "resend";

export async function SendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_KEY || "");
  // console.log({ to, subject, react });
  try {
    const data = await resend.emails.send({
      from: "Dhan Chakra <dhancharka@resend.dev>",
      to,
      subject,
      react,
    });
    // console.log(data);
    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}
