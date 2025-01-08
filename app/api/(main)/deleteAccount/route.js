import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/primsa";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { accountId } = await req.json();

    const userId = await getUserId(req);

    // check user login chhe k nai

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to retrieve user ID." },
        { status: 401 }
      );
    }

    const deletedAccount = await db.account.delete({
      where: {
        userId: userId,
        id: accountId,
      },
    });

    // console.log(deletedAccount);

    return NextResponse.json({ deletedAccount });
  } catch (error) {
    // console.log(error);
    // console.log(error.message);
    return NextResponse.json({ error: error.message });
  }
};
