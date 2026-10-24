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
    isPaid: false,
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
            isPaid: link.isPaid ?? false,
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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <p className="text-neutral-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <nav className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/admin/links" className="text-neutral-400 hover:text-white transition-colors text-sm">
            ← Retour
          </Link>
          <span className="font-semibold text-white">Modifier le lien</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Modifier</h1>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Supprimer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Titre *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">URL *</label>
            <input
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              required
              className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Catégorie *</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
              <label className="block text-sm font-medium text-neutral-400 mb-2">Plateforme</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="isSecure"
                checked={form.isSecure}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-[#09090b]"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Sécurisé</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="isPaid"
                checked={form.isPaid}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/10 bg-[#09090b] text-amber-500 focus:ring-amber-500 focus:ring-offset-[#09090b]"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Payant</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/10 bg-[#09090b] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#09090b]"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Actif</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link
              href="/admin/links"
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}