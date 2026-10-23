'use client';

export default function CategoryFilter({ categories, activeSlug, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          !activeSlug
            ? 'bg-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]'
            : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
        }`}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeSlug === cat.slug
              ? 'bg-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
