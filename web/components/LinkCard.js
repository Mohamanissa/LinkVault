'use client';

export default function LinkCard({ link }) {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
            {link.category?.icon} {link.category?.name}
          </span>
          {link.isSecure && (
            <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-bold">
              ✓ Sécurisé
            </span>
          )}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-300 transition-colors">{link.title}</h3>
        {link.description && (
          <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{link.description}</p>
        )}
      </div>
      
      <button
        onClick={handleClick}
        className="w-full mt-2 bg-white/5 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors border border-white/5 hover:border-indigo-500 flex items-center justify-center gap-2"
      >
        Ouvrir le lien <span className="opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
      </button>
    </div>
  );
}
