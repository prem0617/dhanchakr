import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // je user na account find karvna chhe ae user ni id chhe je user login chhe aeni nai
    const { email } = await req.json();

    console.log(email);

    const accounts = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        accounts: true,
      },
    });

    // accounts?.map((data) => console.log(data));

    console.log(accounts.accounts);

    return NextResponse.json({ accounts: accounts.accounts });
  } catch (error) {
    console.log(error.message || error || "Error in find Split Account");
    return NextResponse.json({
      error: error.message || error || "Error in find Split Account",
    });
  }
}
