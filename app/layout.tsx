import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Video Designer Portfolio",
  description: "모션그래픽 디자이너 루멜의 포트폴리오",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

