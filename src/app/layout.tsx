import { Provider } from "@/components/ui/provider";
import "@radix-ui/themes/styles.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kaching",
  description: "Personal finance tracking made simple",
  icons: {
    icon: "/money_face.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
