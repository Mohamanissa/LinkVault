'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LinkCard from '@/components/LinkCard';
import CategoryFilter from '@/components/CategoryFilter';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activePrice, setActivePrice] = useState('all'); // 'all', 'free', 'paid'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [linksRes, catsRes] = await Promise.all([
          fetch('/api/links'),
          fetch('/api/categories'),
        ]);
        setLinks(await linksRes.json());
        setCategories(await catsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = links.filter((l) => {
    // Filtre catégorie
    if (activeCategory && l.category?.slug !== activeCategory) return false;
    
    // Filtre prix
    if (activePrice === 'free' && l.isPaid) return false;
    if (activePrice === 'paid' && !l.isPaid) return false;

    // Filtre recherche
    if (search) {
      const s = search.toLowerCase();
      return (
        l.title.toLowerCase().includes(s) ||
        (l.description || '').toLowerCase().includes(s) ||
        (l.tags || '').toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-neutral-400 text-sm">Explorez tous les liens par catégorie.</p>
        </header>

        <input
          type="search"
          placeholder="Rechercher un lien, une application..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors mb-6 text-sm"
        />

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activePrice={activePrice}
          onPriceChange={setActivePrice}
        />

        {loading ? (
          <p className="text-neutral-500 text-center py-12">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-neutral-500 text-center py-12">Aucun lien trouvé</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </main>
      <WhatsAppButton />
    </>
  );
}