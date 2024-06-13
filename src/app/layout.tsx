import { Metadata } from "next";
import "@assets/index.css";
import NavMenu from "@/components/NavMenu";
import Debug from "@/components/modals/Debug";

export const metadata: Metadata = {
  title: "Tickety"
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const debugId = 'debugwindow';
  return (
    <html lang="en">
      <body className="flex flex-col w-full h-full">
        <Debug id={debugId} />
        <NavMenu />
        {children}
      </body>
    </html>
  );
}
