import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import AppBootstrap from "@/components/shared/AppBootstrap";
import SonnerProvider from "@/components/shared/SonnerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const siteConfig = {
  name: "OshudSheba",
  title: "OshudSheba | Online Medicine & Healthcare Platform",
  description:
    "OshudSheba is your trusted online healthcare platform for medicines, healthcare products, and essential wellness solutions. Explore products and enjoy convenient delivery across Bangladesh.",
  url: "https://oshudsheba.com",
  logo: "/logo.png",
  ogImage: "/og-image.png",
  locale: "en_BD",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: [
    "OshudSheba",
    "Oshud Sheba",
    "online pharmacy Bangladesh",
    "online medicine shop Bangladesh",
    "medicine delivery Bangladesh",
    "healthcare products Bangladesh",
    "online healthcare platform",
    "pharmacy Bangladesh",
    "health and wellness products",
    "buy medicine online",
  ],

  applicationName: siteConfig.name,

  authors: [
    {
      name: "OshudSheba Team",
      url: siteConfig.url,
    },
  ],

  creator: siteConfig.name,
  publisher: siteConfig.name,

  category: "healthcare",
  classification: "Healthcare and E-commerce",

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,

    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "OshudSheba - Online Medicine and Healthcare Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],

    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* <AnalyticsPageView /> */}
        <UserProvider>
          <SonnerProvider />
          <AppBootstrap>{children}</AppBootstrap>
        </UserProvider>
      </body>
    </html>
  );
}
