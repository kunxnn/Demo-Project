import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google"
import "../globals.css"


//ui alert
import { Toaster } from 'react-hot-toast';

const baiJamjuree = Bai_Jamjuree({
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "swap",
  variable: "--font-bai-jamjuree",
})

export const metadata: Metadata = {
  title: "ระบบเวชระเบียน",
  description: "ระบบเวชระเบียน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
