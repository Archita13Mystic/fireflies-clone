import React from "react";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ClientLayoutWrapper from "../components/layout/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Fireflies.ai — AI Meeting Assistant Workspace",
  description: "Functional clone of Fireflies.ai meeting assistant with interactive transcripts, audio sync, AI summaries, and Action Items.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-[#0f0f13]">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#0f0f13] text-white font-sans antialiased overflow-hidden">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>

        {/* Global Toast Provider */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e1e2a",
              color: "#ffffff",
              border: "1px solid #2a2a3a",
            },
          }}
        />
      </body>
    </html>
  );
}
