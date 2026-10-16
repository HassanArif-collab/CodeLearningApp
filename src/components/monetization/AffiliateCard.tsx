import React from 'react';
import { MONETIZATION_CONFIG } from '../../config/monetization';
import { ExternalLink, Award } from 'lucide-react';

interface AffiliateCardProps {
  category: string;
  className?: string;
}

export const AffiliateCard: React.FC<AffiliateCardProps> = ({ category, className = '' }) => {
  // Find matching offer or fallback to first
  const offer =
    MONETIZATION_CONFIG.affiliates.find((o) => o.category === category) ||
    MONETIZATION_CONFIG.affiliates[0];

  if (!offer) return null;

  return (
    <div className={`rounded-xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <Award className="h-3 w-3" />
          {offer.badge}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Recommended Partner</span>
      </div>

      <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300">
        {offer.title}
      </h4>

      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
        {offer.description}
      </p>

      <a
        href={offer.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-lg transition shadow shadow-emerald-500/20"
      >
        <span>{offer.ctaText}</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};
