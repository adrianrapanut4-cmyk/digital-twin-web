import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Adrian Kyle T. Rapanut — Digital Twin",
  description: "Transforming ideas into technology-driven solutions. AI Builder, BSIT Student, RAG Developer. Interactive AI-powered portfolio with RAG, voice input, and analytics.",
  keywords: ["Adrian Kyle Rapanut", "Digital Twin", "AI Builder", "RAG", "Portfolio", "Upstash Vector", "Groq", "Next.js", "Ausbiz Consulting"],
  authors: [{ name: "Adrian Kyle T. Rapanut" }],
  creator: "Adrian Kyle T. Rapanut",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://digital-twin-web-hazel.vercel.app",
    siteName: "Adrian Kyle T. Rapanut — Digital Twin",
    title: "Adrian Kyle T. Rapanut — AI-Powered Digital Twin Portfolio",
    description: "Interactive AI portfolio powered by RAG — ask my digital twin anything about my background, projects, and skills. Built with Next.js, Upstash Vector, and Groq.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrian Kyle T. Rapanut — Digital Twin",
    description: "Interactive AI portfolio powered by RAG. Ask my digital twin about my AI projects, skills, and experience.",
    creator: "@adrianrapanut",
  },
  metadataBase: new URL("https://digital-twin-web-hazel.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
