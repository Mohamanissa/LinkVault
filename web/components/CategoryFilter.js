'use client';

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, activePrice, onPriceChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            !activeCategory
              ? 'bg-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          Toutes
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? 'bg-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="flex bg-white/5 rounded-full p-1 border border-white/5 w-fit">
        <button
          onClick={() => onPriceChange('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            activePrice === 'all' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => onPriceChange('free')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            activePrice === 'free' ? 'bg-emerald-500/20 text-emerald-400' : 'text-neutral-400 hover:text-emerald-400'
          }`}
        >
          Gratuit
        </button>
        <button
          onClick={() => onPriceChange('freemium')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            activePrice === 'freemium' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-400 hover:text-blue-400'
          }`}
        >
           Freemium
        </button>
        <button
          onClick={() => onPriceChange('paid')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            activePrice === 'paid' ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-amber-400'
          }`}
        >
           Payant
        </button>
      </div>
      
    </div>
  );
}