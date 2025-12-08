import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedConnect",
  description: "Find doctors and book appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
