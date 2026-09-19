
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers/Providers";
import ClientActivityTracker from "./user/components/ClientActivityTracker";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JMFINEX",
  description: "JMFinex is a next-generation trading technology ecosystem — combining AI-driven analytics, automated infrastructure and real-time global market data into a single, secure platform.",
  icons: {
    icon: [
      { url: "/faviocn.png", sizes: "32x32", type: "image/png" },
      { url: "/faviocn.png", sizes: "192x192", type: "image/png" },
      { url: "/faviocn.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/faviocn.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientActivityTracker />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

