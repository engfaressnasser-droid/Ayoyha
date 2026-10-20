import React, { useState } from 'react';
import { Flame, Sparkles, RefreshCw, Heart, Edit3 } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

interface BirthdayWishSectionProps {
  partnerName: string;
  cakeMessage?: string;
  wishMessageBody?: string;
  canEdit?: boolean;
  wishSectionTitle?: string;
  wishSectionSubtitle?: string;
  onEditSection?: (tab: 'basic' | 'hero' | 'letters' | 'reasons' | 'gallery' | 'cake' | 'music' | 'footer') => void;
}

export const BirthdayWishSection: React.FC<BirthdayWishSectionProps> = ({
  partnerName,
  cakeMessage,
  wishMessageBody = 'يا رب يجعل أيامك الجاية كلها سكر زي قلبك، ويفرح روحك وما يوريني فيكي أي حاجة وحشة أبداً، وتفضلي منورة حياتي ومحليّاها دايماً يا أجمل حظ في عمري.',
  canEdit,
  wishSectionTitle = 'طفي الشمعة واتمني أمنية من قلبك',
  wishSectionSubtitle = 'احتفالنا بسنتك الجديدة · أمنيات من كل القلب',
  onEditSection,
}) => {
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [showWishLetter, setShowWishLetter] = useState<boolean>(false);

  const handleBlowCandle = () => {
    if (isBlown) return;
    setIsBlown(true);
    romanticAudio.playCelebrationChime();
    setTimeout(() => {
      setShowWishLetter(true);
    }, 600);
  };

  const handleRelight = () => {
    setIsBlown(false);
    setShowWishLetter(false);
  };

  const activeCakeText = cakeMessage && cakeMessage.trim() !== ''
    ? cakeMessage
    : `كل سنة وأنتي طيبة يا ${partnerName || 'حبيبتي'}`;

  return (
    <section id="wish" className="relative py-14 sm:py-24 px-3 sm:px-6 max-w-4xl mx-auto text-center">
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-2">
          <span>{wishSectionSubtitle}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {wishSectionTitle}
          </h2>
          {canEdit && onEditSection && (
            <button
              onClick={() => onEditSection('cake')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 hover:bg-rose-900 text-amber-200 text-xs font-semibold transition-all cursor-pointer border border-rose-700/50 shadow"
              title="تعديل عبارة التورتة والدعاء"
            >
              <Edit3 className="w-3 h-3 text-amber-300" />
              <span>تعديل التورتة والدعاء</span>
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-rose-300/70 mt-2 max-w-md mx-auto px-2">
          غمضي عينيكي الحلوين، اتمني كل اللي نفسك فيه، ودوسي على الشمعة عشان تطفيها يا روحي!
        </p>
      </div>

      {/* Interactive Birthday Cake and Candle */}
      <div className="relative max-w-md mx-auto bg-gradient-to-b from-[#180d24] to-[#100619] border border-rose-800/40 rounded-2xl sm:rounded-3xl p-5 sm:p-12 shadow-2xl box-glow flex flex-col items-center">
        {/* Candle Setup */}
        <div className="relative mb-5 sm:mb-6 flex flex-col items-center">
          {/* Flame or Smoke */}
          {!isBlown ? (
            <div
              onClick={handleBlowCandle}
              title="دوسي هنا عشان تطفي الشمعة"
              className="cursor-pointer group flex flex-col items-center p-2 active:scale-95 transition-transform"
            >
              {/* Flame glow */}
              <div className="w-7 h-9 sm:w-8 sm:h-10 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white animate-pulse shadow-lg shadow-amber-400/80 group-hover:scale-125 transition-transform" />
              <div className="w-1.5 h-3.5 sm:h-4 bg-neutral-300 rounded-t-sm" />
            </div>
          ) : (
            <div className="flex flex-col items-center p-2">
              <div className="text-[11px] sm:text-xs text-rose-300/70 font-mono italic animate-pulse mb-1">
                💨 انطفت الشمعة ودعوتك طلعت للسما يا قلبي
              </div>
              <div className="w-1.5 h-3.5 sm:h-4 bg-neutral-600 rounded-t-sm" />
            </div>
          )}

          {/* Candle Body */}
          <div className="w-7 h-16 sm:w-8 sm:h-20 bg-gradient-to-b from-rose-400 via-pink-300 to-rose-500 rounded-md shadow-md border-x border-rose-200/40 flex items-center justify-center">
            <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80 fill-white" />
          </div>

          {/* Cake Layers */}
          <div className="w-40 sm:w-48 h-10 sm:h-12 bg-gradient-to-r from-rose-900 via-purple-900 to-rose-900 rounded-t-2xl border-t-2 border-rose-300/40 shadow-inner flex items-center justify-center">
            <div className="flex gap-3 sm:gap-4">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-300 animate-ping" />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-200" />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-300" />
            </div>
          </div>
          <div className="w-full max-w-[260px] sm:max-w-sm px-3 sm:px-4 py-2.5 sm:py-3 min-h-[3.5rem] bg-gradient-to-r from-rose-950 via-[#251036] to-rose-950 rounded-b-2xl border-t border-rose-500/20 shadow-xl flex items-center justify-center text-center">
            <span className="text-[11px] sm:text-xs font-semibold text-rose-200/90 tracking-wide font-heading [text-wrap:balance]">
              {activeCakeText}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {!isBlown ? (
          <button
            onClick={handleBlowCandle}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Flame className="w-4 h-4 fill-current text-yellow-200" />
            <span>طفي الشمعة دلوقتي</span>
          </button>
        ) : (
          <button
            onClick={handleRelight}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 border border-rose-800/40 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            <span>ولعي الشمعة تاني</span>
          </button>
        )}

        {/* Revealed Secret Birthday Wish */}
        {showWishLetter && (
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-rose-900/40 w-full animate-in fade-in slide-in-from-bottom duration-500 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أمنيتي ودعائي ليكي في سنتك الجديدة يا ست البنات</span>
            </div>
            <p className="font-poetry text-base sm:text-xl text-rose-100/90 leading-relaxed [text-wrap:balance]">
              "{wishMessageBody}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
