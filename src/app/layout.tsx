import { Anton_SC, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";

const antonSC = Anton_SC({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      className={`${antonSC.variable} ${barlowCondensed.variable} ${barlow.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}