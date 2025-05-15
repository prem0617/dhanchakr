import { Receipt, PieChart, IndianRupee } from "lucide-react";

import {
  CreditCard,
  Bank,
  ChartBar,
  Users,
  FileArrowDown,
} from "phosphor-react";

// Stats Data
export const statsData = [
  {
    value: "5+",
    label: "Active Users",
  },
  {
    value: "50+",
    label: "Transactions Tracked",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Planning",
    description: "Create and manage budgets",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description: "Manage multiple accounts",
  },
];

export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. User Registration & Login",
    description:
      "Sign up with your email and securely log in using OTP for authorized access.",
  },
  {
    icon: <Bank className="h-8 w-8 text-blue-600" />,
    title: "2. Set Up Your Accounts",
    description:
      "Add your financial accounts and set a default account for easy transaction entry.",
  },
  {
    icon: <IndianRupee className="h-8 w-8 text-blue-600" />,
    title: "3. Add Transactions",
    description:
      "Manually enter transactions or upload receipts to auto-extract details using Gemini AI.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "4. Split Expenses",
    description:
      "Track and manage shared expenses with friends or family members effortlessly.",
  },
  {
    icon: <ChartBar className="h-8 w-8 text-blue-600" />,
    title: "5. Visual Insights",
    description:
      "View your spending patterns in clear bar and pie charts to make informed decisions.",
  },
  {
    icon: <FileArrowDown className="h-8 w-8 text-blue-600" />,
    title: "6. Export Your Data",
    description:
      "Download your transaction history as CSV for offline viewing or backups.",
  },
];
