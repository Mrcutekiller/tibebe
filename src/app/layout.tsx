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
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "600", "700"],
  variable: "--font-ethiopic",
  display: "swap",
  preload: false,
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
  description: "Past exam tests for Ethiopian university students, and Telegram Premium. Study with answers and explanations. Pay with Telebirr or Chapa.",
  keywords: ["Ethiopia university exams", "past exam papers", "AAU exams", "study materials Ethiopia", "Telegram Premium Ethiopia"],
  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Tibeb",
    title: "Tibeb — Study Smarter, Pass with Confidence",
    description: "Past exam tests for Ethiopian university students, and Telegram Premium. Study with answers and explanations. Pay with Telebirr or Chapa.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tibeb — Past Exam Tests & Telegram Premium in Ethiopia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tibeb — Past Exam Tests & Telegram Premium",
    description: "Study with answers and explanations. Pay with Telebirr or Chapa.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `,
          }}
        />
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
