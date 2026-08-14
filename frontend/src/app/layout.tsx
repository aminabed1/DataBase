import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScrolling from "@/components/ui/SmoothScrolling";
import Navbar from "@/components/layout/Navbar";
import ReactQueryProvider from "@/lib/react-query"; // <-- ایمپورت پروایدر

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PitchSide",
  description: "Live sports, instant tickets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-[family-name:var(--font-sans)]">
        <ReactQueryProvider>
          <Navbar />
          <SmoothScrolling>
            {children}
            <CustomCursor />
          </SmoothScrolling>
        </ReactQueryProvider>
      </body>
    </html>
  );
}