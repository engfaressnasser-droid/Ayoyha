import React from 'react';
import { Heart, ArrowUp, Edit3 } from 'lucide-react';

interface FooterProps {
  partnerName: string;
  senderName: string;
  footerLoveText?: string;
  footerSubtext?: string;
  canEdit?: boolean;
  onEditSection?: (tab: 'basic' | 'hero' | 'letters' | 'reasons' | 'gallery' | 'cake' | 'music' | 'footer') => void;
}

export const Footer: React.FC<FooterProps> = ({
  partnerName,
  senderName,
  footerLoveText = 'اتعملت بكل حب عشان عيون',
  footerSubtext = 'كل ثانية، وكل دقيقة، وكل سنة.. وأنتي أجمل نعمة في حياتي ومنورة دنيتي كلها.',
  canEdit,
  onEditSection,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-rose-950/50 bg-[#09040f] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-right">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-rose-300 font-semibold mb-1 text-sm sm:text-base">
            <span>{footerLoveText} {partnerName || 'حبيبة قلبي'}</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            {canEdit && onEditSection && (
              <button
                onClick={() => onEditSection('footer')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-amber-200 text-[10px] transition-all cursor-pointer border border-rose-700/50"
                title="تعديل الفوتر"
              >
                <Edit3 className="w-2.5 h-2.5 text-amber-300" />
                <span>تعديل</span>
              </button>
            )}
          </div>
          <p className="text-xs text-rose-400/60 font-poetry max-w-md">
            {footerSubtext}
          </p>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/80 hover:bg-rose-950/60 border border-rose-900/30 text-rose-300 text-xs transition-colors cursor-pointer"
        >
          <span>اطلعي لفوق</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
