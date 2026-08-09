import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MarketNest – Quality Products at Amazing Prices",
  description:
    "Discover quality products at unbeatable prices. Shop from our curated collection or grab exclusive partner deals with fast delivery.",
  icons: {
    icon: [
      { url: "/1000282492.png", sizes: "any" },
      { url: "/1000282492.png", sizes: "16x16", type: "image/png" },
      { url: "/1000282492.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/1000282492.png",
    apple: "/1000282492.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          margin: 0,
          width: "100%",
        }}
      >
        <Providers>
          <Navbar />
          <main style={{ flexGrow: 1, width: "100%" }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
