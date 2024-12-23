import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getUserId = async (req) => {
  try {
    const cookieStore = await cookies(); // Await the cookie store
    const tokenCookie = cookieStore.get("jwttoken"); // Access the cookie
    const token = tokenCookie?.value; // Safely retrieve the value

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(payload);
    // console.log(token);

    if (payload.id) {
      const userId = payload.id;

      return userId;
    }
  } catch (error) {
    console.log("Error in getUserId:", error.message);
    return null; // Return null if an error occurs
  }
};
