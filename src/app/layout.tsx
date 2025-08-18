import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const baiJamjuree = Bai_Jamjuree({
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "swap",
  variable: "--font-bai-jamjuree",
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={baiJamjuree.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
