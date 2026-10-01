'use client';

export default function CategoryFilter({ categories, activeSlug, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeSlug
            ? 'bg-red-600 text-white'
            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
        }`}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSlug === cat.slug
              ? 'bg-red-600 text-white'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
