'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
    load();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce lien ?')) return;
    await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
    setLinks(links.filter((l) => l.id !== id));
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  return (
    <div className="min-h-screen">
      <nav className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">LV</span>
            <span className="font-bold">LinkVault Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/links" className="text-neutral-400 hover:text-white">
              Liens
            </Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

        {loading ? (
          <p className="text-neutral-500">Chargement...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{links.length}</div>
                <div className="text-neutral-400 text-sm mt-1">Liens au total</div>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{categories.length}</div>
                <div className="text-neutral-400 text-sm mt-1">Catégories</div>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{totalClicks}</div>
                <div className="text-neutral-400 text-sm mt-1">Clics cumulés</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Derniers liens</h2>
              <Link
                href="/admin/links/new"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                + Nouveau lien
              </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              {links.length === 0 ? (
                <p className="text-neutral-500 p-6">Aucun lien</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-neutral-950 text-neutral-400">
                    <tr>
                      <th className="text-left px-4 py-3">Titre</th>
                      <th className="text-left px-4 py-3">Catégorie</th>
                      <th className="text-left px-4 py-3">Clics</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.slice(0, 10).map((link) => (
                      <tr key={link.id} className="border-t border-neutral-800">
                        <td className="px-4 py-3 text-white">{link.title}</td>
                        <td className="px-4 py-3 text-neutral-400">
                          {link.category?.icon} {link.category?.name}
                        </td>
                        <td className="px-4 py-3 text-neutral-400">{link.clicks}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/links/${link.id}`}
                            className="text-blue-400 hover:text-blue-300 mr-3"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
