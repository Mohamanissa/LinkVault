'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLinksPage() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const router = useRouter();

  async function load() {
    try {
      const [linksRes, catsRes] = await Promise.all([
        fetch('/api/admin/links'),
        fetch('/api/categories'),
      ]);

      if (linksRes.status === 401) {
        router.push('/admin');
        return;
      }

      setLinks(await linksRes.json());
      setCategories(await catsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLinks(links.filter((l) => l.id !== id));
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const filtered = links.filter((l) => {
    if (!filter) return true;
    const s = filter.toLowerCase();
    return (
      l.title.toLowerCase().includes(s) ||
      (l.url || '').toLowerCase().includes(s) ||
      (l.category?.name || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Navbar admin */}
      <nav className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <span className="font-bold">LinkVault Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/admin/links" className="text-red-500">
                Liens
              </Link>
              <Link href="/admin/categories" className="text-neutral-400 hover:text-white">
                Catégories
              </Link>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">🔗 Gestion des liens</h1>
            <p className="text-neutral-400 text-sm mt-1">
              {links.length} lien{links.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Link
            href="/admin/links/new"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            + Nouveau lien
          </Link>
        </div>

        <input
          type="search"
          placeholder="Rechercher par titre, URL, catégorie..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 mb-6"
        />

        {loading ? (
          <p className="text-neutral-500 text-center py-12">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
            <p className="text-neutral-500 mb-4">
              {filter ? 'Aucun résultat' : 'Aucun lien pour le moment'}
            </p>
            {!filter && (
              <Link
                href="/admin/links/new"
                className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                Créer le premier lien
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="text-left px-4 py-3">Titre</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">URL</th>
                  <th className="text-left px-4 py-3">Clics</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((link) => (
                  <tr key={link.id} className="border-t border-neutral-800 hover:bg-neutral-950/50">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{link.title}</div>
                      <div className="text-neutral-500 text-xs md:hidden">
                        {link.category?.icon} {link.category?.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 hidden md:table-cell">
                      {link.category?.icon} {link.category?.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 hidden lg:table-cell truncate max-w-xs">
                      {link.url}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{link.clicks}</td>
                    <td className="px-4 py-3">
                      {link.isSecure && (
                        <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">
                          ✓ Sécurisé
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white mr-3"
                        title="Voir"
                      >
                        ↗
                      </a>
                      <Link
                        href={`/admin/links/${link.id}`}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(link.id, link.title)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
