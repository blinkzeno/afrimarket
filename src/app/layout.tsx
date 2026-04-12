import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AfriMarket - Votre marché africain en ligne",
  description: "Découvrez des produits authentiques africains et soutenez les artisans et producteurs africains.",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-warm-5">
        <Providers>
          <Header user={user} onSignOut={signOut} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
