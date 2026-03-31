import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PharOS — AI Compliance Command Center',
  description: 'Pharmaceutical compliance monitoring and AI-powered procurement platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-layer">
          <div className="bg-grid" />
          <div className="bg-noise" />
        </div>
        {children}
      </body>
    </html>
  );
}
