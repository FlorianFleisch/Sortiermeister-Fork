export const metadata = {
  title: 'Sortiermeister',
  description: 'Sortiermeister - Wettrennen gegen den Computer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="stylesheet" href="/styles/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
