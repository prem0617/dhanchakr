import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Helper to format cookies
import { NextResponse } from "next/server";

const generateTokenAndSetCookie = ({ response, id, email }) => {
  // Define the JWT payload
  const payload = { id, email };

  // Generate the JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Create the cookie
  response.cookies.set("jwttoken", token);

  return response;
};

export default generateTokenAndSetCookie;
