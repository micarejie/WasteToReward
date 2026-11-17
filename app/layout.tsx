import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono, Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { AppToaster } from "@/components/AppToaster";
import { getProfile } from "@/lib/data/repository";
import { isDemoMode } from "@/lib/demo/mode";
import { siteUrl } from "@/lib/site";
import "sonner/dist/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let name = "IT Student Portfolio";
  let description = "A portfolio of projects, studies, and learning notes from an information technology student.";
  try {
    const profile = await getProfile();
    if (profile) {
      name = profile.full_name;
      description = profile.tagline || profile.bio || description;
    }
  } catch {
    // Metadata falls back when the database is unavailable.
  }
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${name} | IT Student Portfolio`,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: name,
      locale: "en_PH",
    },
    robots: { index: true, follow: true },
  };
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let profile = null;
  try {
    profile = await getProfile();
  } catch (error) {
    console.error(error);
  }
  const demo = isDemoMode();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AppShell profile={profile} demo={demo}>
          {children}
        </AppShell>
        <AppToaster />
      </body>
    </html>
  );
}
