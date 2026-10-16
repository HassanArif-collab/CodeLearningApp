import React from 'react';
import { MONETIZATION_CONFIG } from '../../config/monetization';

interface AdSlotProps {
  slotType: 'leaderboard' | 'sidebar' | 'banner';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotType, className = '' }) => {
  if (!MONETIZATION_CONFIG.ads.enabled) return null;

  const isDevPlaceholder = MONETIZATION_CONFIG.ads.showPlaceholderInDev;

  const getDimensions = () => {
    switch (slotType) {
      case 'leaderboard':
        return 'min-h-[90px] w-full';
      case 'sidebar':
        return 'min-h-[250px] w-full';
      case 'banner':
      default:
        return 'min-h-[100px] w-full';
    }
  };

  return (
    <div className={`my-4 overflow-hidden rounded-xl border border-dashed border-slate-700/60 bg-slate-900/40 p-3 text-center flex flex-col items-center justify-center ${getDimensions()} ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
          Sponsored Resource
        </span>
      </div>

      {isDevPlaceholder ? (
        <div className="text-xs text-slate-400 max-w-md">
          <p className="font-medium text-slate-300">Google AdSense / EthicalAds Slot ({slotType})</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Non-intrusive ad placement helps keep CodeLens CS 100% free for university students worldwide.
          </p>
        </div>
      ) : (
        /* Actual AdSense Tag when client ID is provided */
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={MONETIZATION_CONFIG.ads.googleAdSenseClientId}
          data-ad-slot={
            slotType === 'leaderboard'
              ? MONETIZATION_CONFIG.ads.slots.topLeaderboard
              : MONETIZATION_CONFIG.ads.slots.visualizerSidebar
          }
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};
