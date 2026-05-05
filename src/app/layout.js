import "./globals.css";
import Providers from "@/components/Providers";
import { MainLayout } from "@/components/layout/MainLayout";

export const metadata = {
  title: "Ellegance | Curated Choreography",
  description: "A specialized platform for ballroom dance choreography and note-taking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="stylesheet" crossOrigin="anonymous" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="stylesheet" crossOrigin="anonymous" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body shadow-2xl overflow-x-hidden">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
