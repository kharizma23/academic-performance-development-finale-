import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { GlobalWidget } from "@/components/global-widget";

export const metadata: Metadata = {
 title: "Student Academic Development Platform",
 description: "AI-Powered Academic Intelligence System",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" suppressHydrationWarning>
 <body
 suppressHydrationWarning
 className={cn(
 "min-h-screen w-full overflow-x-hidden text-foreground font-sans antialiased"
 )}
 >
 {children}
 <GlobalWidget />
 </body>
 </html>
 );
}
