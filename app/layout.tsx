import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Sustainable Marketing Assistant",
  description: "Generate and manage sustainable marketing campaigns with AI, focusing on product, pricing, promotion, and distribution sustainability.",
  keywords: ["AI", "Marketing", "Sustainable", "Campaigns", "SaaS", "Eco-friendly"],
  authors: [{ name: "AI Sustainable Marketing" }],
  openGraph: {
    title: "AI Sustainable Marketing Assistant",
    description: "Generate and manage sustainable marketing campaigns with AI.",
    siteName: "AI Sustainable Marketing Assistant",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sustainable Marketing Assistant",
    description: "Generate and manage sustainable marketing campaigns with AI.",
  },
};

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div className="h-16 border-b border-border/40 w-full" />}>
          <Navbar />
        </Suspense>
        <main className="container mx-auto p-4">
          <Suspense fallback={<div className="flex justify-center p-8"><Skeleton className="h-32 w-full" /></div>}>
            {children}
          </Suspense>
        </main>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
