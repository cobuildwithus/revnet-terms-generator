import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WagmiProvider } from "@/lib/wagmi-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CSSProperties } from "react";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Revnet me",
  description: "Launch your Revnet in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        style={{ "--header-height": "70px" } as CSSProperties}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiProvider>
            <Header />
            {children}
            <Toaster />
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
