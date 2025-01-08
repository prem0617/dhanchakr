import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id: accountId } = await req.json();

    console.log(accountId);

    const userId = await getUserId(req);

    console.log(userId);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    await db.account.updateMany({
      where: {
        userId: userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const updatedDefault = await db.account.update({
      where: {
        id: accountId,
        userId: userId,
      },
      data: {
        isDefault: true,
      },
    });

    console.log(updatedDefault);

    return NextResponse.json(updatedDefault.id);
  } catch (error) {
    console.log(error.message || error || "Error in Chege default Account");
    return NextResponse.json(
      {
        error: error.message || error || "Error in Change default Account",
      },
      { status: 500 }
    );
  }
}
