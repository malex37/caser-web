import { Metadata } from "next";
import "@assets/index.css";
import NavMenu from "@components/NavMenu";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import ToastMessage from "@components/ToastMessage";
import Debug from "@components/modals/Debug";

export const metadata: Metadata = {
  title: "Tickety"
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const requestPath = cookies().get('path')?.value;
  const isLogin = requestPath && requestPath !== '/login';
  const debugId = 'debugwindow';
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex flex-col w-full h-full">
        {
          process.env.NODE_ENV === 'development' ? <Debug id={debugId}/> : <></>
        }
        {/* <Debug id={debugId} /> */}
        {!isLogin ? <NavMenu /> : <></>}
        <ToastMessage />
        {children}
      </body>
    </html>
  );
}
