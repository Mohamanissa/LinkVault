import Link from 'next/link';
import WhatsAppButton from '../components/WhatsAppButton';

export default function LandingPage() {
  const categories = [
    { icon: '', name: 'Animés', desc: 'Streaming légal et officiel' },
    { icon: '', name: 'Films', desc: 'Plateformes de streaming' },
    { icon: '', name: 'Jeux vidéo', desc: 'Boutiques et stores' },
    { icon: '', name: 'Certifications', desc: 'Formations par filière' },
    { icon: '', name: 'Autres', desc: 'Divers liens utiles' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">LV</span>
            <span className="font-bold text-lg">LinkVault</span>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-white">
            Dashboard →
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono px-3 py-1 rounded-full mb-6">
             Liens vérifiés et sécurisés
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
           <span className="text-red-500">BIENVENUE SUR LinkVault</span>
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Tous vos liens <span className="text-red-500">sécurisés</span>
            <br />au même endroit.
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            LinkVault regroupe les meilleurs sites et applications pour les animés, films,
            jeux vidéo et certifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg">
              Accéder au Dashboard →
            </Link>
            <a href="#categories" className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-8 py-4 rounded-lg">
              Voir les catégories
            </a>
          </div>
        </section>

        <section id="categories" className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Explorez par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-center">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-white">{cat.name}</div>
                <div className="text-xs text-neutral-500 mt-1">{cat.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} LinkVault
      </footer>

      <WhatsAppButton />
    </div>
  );
}
