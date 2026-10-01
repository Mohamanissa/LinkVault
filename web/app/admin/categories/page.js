'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    icon: '📦',
    color: '#a29bfe',
    description: '',
    order: 0,
  });

  async function load() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Auto-générer le slug à partir du nom
    if (name === 'name') {
      const autoSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setForm((f) => ({ ...f, slug: autoSlug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/categories', {
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

      // Reset + recharger
      setForm({ name: '', slug: '', icon: '📦', color: '#a29bfe', description: '', order: 0 });
      setShowForm(false);
      await load();
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar admin */}
      <nav className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">LV</span>
              <span className="font-bold">LinkVault Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/admin/links" className="text-neutral-400 hover:text-white">
                Liens
              </Link>
              <Link href="/admin/categories" className="text-red-500">
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
            <h1 className="text-3xl font-bold">📂 Catégories</h1>
            <p className="text-neutral-400 text-sm mt-1">
              {categories.length} catégorie{categories.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            {showForm ? '× Annuler' : '+ Nouvelle catégorie'}
          </button>
        </div>

        {/* Formulaire de création */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6 space-y-4"
          >
            <h2 className="font-bold text-white mb-2">➕ Ajouter une catégorie</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Nom *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
                  placeholder="Ex: Mangas"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Slug *</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-red-600"
                  placeholder="mangas"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Icône (emoji)</label>
                <input
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-center text-2xl focus:outline-none focus:border-red-600"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Couleur</label>
                <input
                  name="color"
                  type="color"
                  value={form.color}
                  onChange={handleChange}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
                placeholder="Description courte..."
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-600/30 text-red-400 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg"
              >
                {saving ? 'Création...' : 'Créer la catégorie'}
              </button>
            </div>
          </form>
        )}

        {/* Grille des catégories */}
        {loading ? (
          <p className="text-neutral-500 text-center py-12">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <div className="font-bold text-white">{cat.name}</div>
                      <div className="text-xs text-neutral-500 font-mono">
                        /{cat.slug}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer"
                  >
                    🗑
                  </button>
                </div>

                {cat.description && (
                  <p className="text-sm text-neutral-400 mb-3">{cat.description}</p>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">
                    {cat._count?.links || 0} lien{(cat._count?.links || 0) > 1 ? 's' : ''}
                  </span>
                  {cat.isActive ? (
                    <span className="text-green-400">● Actif</span>
                  ) : (
                    <span className="text-neutral-600">● Inactif</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
          <h2 className="font-bold text-white mb-2">⚠️ Suppression</h2>
          <p className="text-sm text-neutral-400">
            Une catégorie contenant des liens <strong>ne peut pas être supprimée</strong>.
            Supprime d'abord ses liens depuis la page <Link href="/admin/links" className="text-red-400 hover:underline">Liens</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
