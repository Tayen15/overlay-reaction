import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
     variable: "--font-poppins",
     subsets: ["latin"],
     weight: ["400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
     title: "Overlay Reaction Interactive | oktaa.my.id",
     description: "Overlay reaksi interaktif untuk streaming OBS dengan kontrol dari ponsel",
     icons: {
          icon: "https://cdn.oktaa.my.id/favicon.ico",
          apple: "https://cdn.oktaa.my.id/apple-touch-icon.png",
     },
     openGraph: {
          title: "Overlay Reaction Interactive",
          description: "Overlay reaksi interaktif untuk streaming OBS dengan kontrol dari ponsel",
          url: "https://overlay-reaction-interactive.oktaa.my.id",
          siteName: "Overlay Reaction Interactive",
          images: [
               {
                    url: "https://cdn.oktaa.my.id/og-banner.png",
                    width: 1200,
                    height: 630,
                    alt: "Overlay Reaction Interactive",
               },
          ],
          locale: "en_US",
          type: "website",
     },
};

export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     return (
          <html lang="en">
               <body
                    className={`${poppins.variable} antialiased`}
               >
                    {children}
               </body>
          </html>
     );
}
