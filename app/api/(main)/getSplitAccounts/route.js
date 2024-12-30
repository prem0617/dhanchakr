import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // je user na account find karvna chhe ae user ni id chhe je user login chhe aeni nai
    const { userId } = await req.json();

    console.log(userId);

    const accounts = await db.account.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.log(error.message || error || "Error in find Split Account");
    return NextResponse.json({
      error: error.message || error || "Error in find Split Account",
    });
  }
}
