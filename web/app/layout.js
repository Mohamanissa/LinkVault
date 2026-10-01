import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LinkVault',
  description: 'Annuaire de liens sécurisés : animés, films, jeux vidéo, certifications et plus.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
