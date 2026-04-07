import "./globals.css";

export const metadata = {
  title: "Obsidian Stage | Curated Choreography",
  description: "A specialized platform for ballroom dance choreography and note-taking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body shadow-2xl">
        {children}
      </body>
    </html>
  );
}
