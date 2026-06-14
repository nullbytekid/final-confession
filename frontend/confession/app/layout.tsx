import type { Metadata } from "next";
import { Cedarville_Cursive } from "next/font/google";
import BackgroundMusic, {
  MusicControls,
} from "@/components/BackgroundMusic";
import SiteProvider from "@/components/SiteProvider";
import "./globals.css";

const cedarville = Cedarville_Cursive({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cedarville",
});

export const metadata: Metadata = {
  title: "Something I Want to Confess 💌",
  description: "A love confession website made with all my heart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cedarville.variable} h-full`}>
      <body className="min-h-full antialiased overflow-x-hidden">
        <SiteProvider>
          <BackgroundMusic />
          <MusicControls />
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}
