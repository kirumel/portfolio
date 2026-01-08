import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  title: "kirumelWorks",
  description: "포트폴리오",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSerifKR.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
