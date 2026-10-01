'use client';

import { useState } from 'react';

export default function LinkCard({ link }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-red-600/50 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-red-500">
              {link.category?.icon} {link.category?.name}
            </span>
            {link.isSecure && (
              <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">
                ✓ Sécurisé
              </span>
            )}
          </div>

          <h3 className="text-white font-semibold text-lg truncate">
            {link.title}
          </h3>

          {link.description && (
            <p className={`text-neutral-400 text-sm mt-1 ${showDetails ? '' : 'line-clamp-2'}`}>
              {link.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {link.tags?.split(',').filter(Boolean).map((tag, i) => (
              <span key={i} className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                #{tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleClick}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Ouvrir le lien ↗
        </button>
        {link.description && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm px-3 rounded-lg transition-colors"
          >
            {showDetails ? '−' : '+'}
          </button>
        )}
      </div>
    </div>
  );
}
