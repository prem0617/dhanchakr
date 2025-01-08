import { inngest } from "@/lib/innigest/client";
import { sendBudgetAlert } from "@/lib/innigest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendBudgetAlert],
});
