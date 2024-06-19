import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@assets/index.css";

export const metadata: Metadata = {
  title: "Tickety"
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex flex-col w-full h-full">
        {children}
      </body>
    </html>
  );
}
