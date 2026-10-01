'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewLinkPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: '',
    tags: '',
    platform: 'Web',
    isSecure: true,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        router.push('/admin');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur');
        return;
      }

      router.push('/admin/links');
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/admin/links" className="text-neutral-400 hover:text-white">
            ← Retour
          </Link>
          <span className="font-bold">Nouveau lien</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">➕ Ajouter un lien</h1>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Titre *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
              placeholder="Ex: Crunchyroll"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">URL *</label>
            <input
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
              placeholder="Description du site ou de l'app..."
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Catégorie *</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
            >
              <option value="">— Choisir une catégorie —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Plateforme</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
              >
                <option value="Web">Web</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Linux">Linux</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">Tags (séparés par virgule)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
                placeholder="streaming,officiel"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isSecure"
              checked={form.isSecure}
              onChange={handleChange}
              className="w-4 h-4 accent-red-600"
            />
            <span className="text-sm text-neutral-300">Lien vérifié et sécurisé</span>
          </label>

          {error && (
            <div className="bg-red-900/20 border border-red-600/30 text-red-400 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg"
            >
              {loading ? 'Enregistrement...' : 'Créer le lien'}
            </button>
            <Link
              href="/admin/links"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-6 py-2.5 rounded-lg"
            >
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
