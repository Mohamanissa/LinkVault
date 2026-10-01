'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditLinkPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: '',
    tags: '',
    platform: 'Web',
    isSecure: true,
    isActive: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [linkRes, catsRes] = await Promise.all([
          fetch(`/api/admin/links/${id}`),
          fetch('/api/categories'),
        ]);

        if (linkRes.status === 401) {
          router.push('/admin');
          return;
        }

        if (catsRes.ok) setCategories(await catsRes.json());

        if (linkRes.ok) {
          const link = await linkRes.json();
          setForm({
            title: link.title || '',
            url: link.url || '',
            description: link.description || '',
            categoryId: link.categoryId || '',
            tags: link.tags || '',
            platform: link.platform || 'Web',
            isSecure: link.isSecure ?? true,
            isActive: link.isActive ?? true,
          });
        } else {
          setError('Lien introuvable');
        }
      } catch (e) {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/links/${id}`, {
        method: 'PUT',
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
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce lien ?')) return;
    const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/links');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/admin/links" className="text-neutral-400 hover:text-white">
            ← Retour
          </Link>
          <span className="font-bold">Modifier le lien</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">✏️ Modifier</h1>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Supprimer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Titre *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
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
              <option value="">— Choisir —</option>
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
              <label className="block text-sm text-neutral-400 mb-2">Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isSecure"
                checked={form.isSecure}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm text-neutral-300">Sécurisé</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm text-neutral-300">Actif</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-600/30 text-red-400 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
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
