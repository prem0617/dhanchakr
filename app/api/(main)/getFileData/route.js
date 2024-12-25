import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { base64String, type } = await req.json();
    if (!base64String)
      return NextResponse.json(
        { error: "File not Found", success: false },
        { status: 400 }
      );

    // console.log({ base64String, type });

    const prompt = `
        Analyze this receipt image and extract the following information in JSON format:
        - Total amount (just the number)
        - Expense type (determine as "EXPENSE" or "INCOME" from your knowledge)
        - Account ID (if not available on the receipt, leave it blank)
        - Suggested category (one of: Housing, Transportation, Groceries, Utilities, Entertainment, Food, Shopping, Healthcare, Education, Personal, Travel, Insurance, Gifts, Bills, other-expense)
        - Date (in ISO format)
        - Description or items purchased (brief summary)

        Only respond with valid JSON in this exact format:
        {
          "amount": "",
          "expenseType": "",
          "accountId": "",
          "category": "",
          "date": "",
          "description": ""
        }

        If it's not a receipt, return an empty object.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: type,
        },
      },
      prompt,
    ]);

    const response = await result.response;

    // console.log(response);

    const text = response.text();

    // console.log(text);

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    // console.log(cleanedText);

    try {
      const data = JSON.parse(cleanedText);
      console.log(data);

      const reciptData = {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
        expenseType: data.expenseType,
      };

      return NextResponse.json(reciptData);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }

    // return NextResponse.json({ base64String, type });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
