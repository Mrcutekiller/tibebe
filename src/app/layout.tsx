import type { Metadata, Viewport } from "next";
import { Poppins, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-ethiopic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B5D3B",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Tibeb — Study Smarter, Pass with Confidence",
    template: "%s | Tibeb",
  },
  description:
    "Ethiopia's #1 student platform. Past exam papers with answers, university courses, and study materials for AAU, JU, BDU, and 15+ universities.",
  keywords: ["Ethiopia university exams", "past exam papers", "AAU exams", "study materials Ethiopia", "Telegram Premium Ethiopia"],
  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Tibeb",
    title: "Tibeb — Study Smarter, Pass with Confidence",
    description:
      "Past exam papers with answers, courses, and study materials for Ethiopian university students.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tibeb",
    description: "Study smarter. Pass with confidence.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tibeb",
  },
};

import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${poppins.variable} ${notoEthiopic.variable}`}>
      <body className={poppins.className}>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
