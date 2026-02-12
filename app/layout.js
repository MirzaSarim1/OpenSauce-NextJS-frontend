import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Open Sauce - Share Your Recipes",
  description: "A community-driven recipe sharing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
