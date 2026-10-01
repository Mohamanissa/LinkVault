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
    if (activeCategory && l.category?.slug !== activeCategory) return false;
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📊 Dashboard</h1>
          <p className="text-neutral-400">Explorez tous les liens par catégorie.</p>
        </header>

        <input
          type="search"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 mb-6"
        />

        <CategoryFilter
          categories={categories}
          activeSlug={activeCategory}
          onChange={setActiveCategory}
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
