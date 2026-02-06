import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNRULY HUMAN | Alloy 000 Bomber Jacket",
  description:
    "Wearable art from artist Ethan S. Brewerton. The Alloy 000 Bomber Jacket features hand-drawn biomechanical patterns, premium materials, and is manufactured in England. Limited edition.",
  keywords: [
    "bomber jacket",
    "wearable art",
    "biomechanical",
    "limited edition",
    "fashion",
    "art fashion",
    "Ethan Brewerton",
    "Unruly Human",
  ],
  openGraph: {
    title: "UNRULY HUMAN | Alloy 000 Bomber Jacket",
    description:
      "Wearable art. Hand-drawn biomechanical patterns. Made in England. $300.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
