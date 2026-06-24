import { Anton_SC, Barlow_Condensed, Barlow } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./globals.scss";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${antonSC.variable} ${barlowCondensed.variable} ${barlow.variable}`}
    >
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}