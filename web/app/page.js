import Link from 'next/link';
import WhatsAppButton from '../components/WhatsAppButton';

export default function LandingPage() {
  const categories = [
    { icon: '', name: 'Animés', desc: 'Streaming officiel' },
    { icon: '', name: 'Films', desc: 'Plateformes légales' },
    { icon: '', name: 'Jeux vidéo', desc: 'Boutiques sécurisées' },
    { icon: '', name: 'Certifications', desc: 'Formations vérifiées' },
    { icon: '', name: 'Autres', desc: 'Outils utiles' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-200 font-sans selection:bg-indigo-500/30">
      <header className="border-b border-white/5 backdrop-blur-md fixed w-full top-0 z-50 bg-[#09090b]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/20 p-1.5 rounded-lg">
              <span className="text-indigo-400 font-bold text-xl">LV</span>
            </div>
            <span className="font-semibold text-white tracking-tight">LinkVault</span>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Dashboard →
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center">
          
          {/* Badge de confiance */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Tous les liens sont vérifiés manuellement
          </div>

          {/* Titre principal - Réduit et moderne */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Vos liens <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">sécurisés</span>, <br className="hidden md:block" />
            au même endroit.
          </h1>
          
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto font-light">
            LinkVault regroupe les meilleurs sites et applications pour vos animés, films, jeux vidéo et certifications. 
            Fini les liens morts et les menaces.
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
              Accéder au Dashboard
            </Link>
            <a href="#categories" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition-all">
              Explorer les catégories
            </a>
          </div>
        </section>

        {/* Section catégories */}
        <section id="categories" className="max-w-6xl mx-auto px-6 py-20 mt-10">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px bg-white/10 flex-1 max-w-[100px]"></div>
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Explorez par catégorie</h2>
            <div className="h-px bg-white/10 flex-1 max-w-[100px]"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all cursor-default">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="font-medium text-white text-sm mb-1">{cat.name}</div>
                <div className="text-xs text-neutral-500">{cat.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-neutral-600">
        © {new Date().getFullYear()} LinkVault — Sécurité et confiance.
      </footer>

      <WhatsAppButton />
    </div>
  );
}
