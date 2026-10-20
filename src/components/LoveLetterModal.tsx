import React, { useState } from 'react';
import { X, Heart, Sparkles, Edit3 } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';
import { RomanticCelebrationCanvas } from './RomanticCelebrationCanvas';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  senderName: string;
  messageBody: string;
  canEdit?: boolean;
  onEditLetter?: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  senderName,
  messageBody,
  canEdit,
  onEditLetter,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [celebrationKey, setCelebrationKey] = useState<number>(0);

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    setCelebrationKey((prev) => prev + 1);
    romanticAudio.playCelebrationChime();
  };

  const retriggerCelebration = () => {
    setCelebrationKey((prev) => prev + 1);
    romanticAudio.playCelebrationChime();
  };

  const handleClose = () => {
    setIsOpened(false);
    onClose();
  };

  return (
    <>
      {/* Visual Celebration Effect (Confetti Ribbons + Shimmering Golden Stars + Falling Hearts) */}
      <RomanticCelebrationCanvas triggerKey={celebrationKey} />

      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-xl w-full text-right"
        >
          {!isOpened ? (
            /* Sealed Romantic Envelope */
            <div className="relative bg-[#210e2f] border border-rose-700/50 rounded-2xl sm:rounded-3xl p-5 sm:p-12 shadow-2xl flex flex-col items-center text-center box-glow overflow-hidden">
              {/* Subtle ambient light */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/10 via-transparent to-amber-500/10 pointer-events-none" />

              <button
                onClick={handleClose}
                aria-label="إغلاق الرسالة"
                className="absolute top-3 left-3 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-rose-600 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {canEdit && onEditLetter && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onEditLetter();
                  }}
                  className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-950/90 hover:bg-rose-800 border border-rose-600/50 text-amber-200 text-[11px] font-medium cursor-pointer z-10"
                >
                  <Edit3 className="w-3 h-3 text-amber-300" />
                  <span>تعديل الجواب</span>
                </button>
              )}

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-xl shadow-rose-900/60 flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
              </div>

              <span className="text-[11px] sm:text-xs text-rose-400 font-mono tracking-widest uppercase mb-1.5 sm:mb-2">
                جواب سري ومقفول عشانك أنتي وبس 💌
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                لأحلى عيون في الدنيا دي كلها.. {partnerName}
              </h3>
              <p className="text-xs sm:text-sm text-rose-200/80 mb-6 sm:mb-8 max-w-xs font-poetry leading-relaxed">
                الظرف ده مقفول ومش هيتفتح غير لست البنات اللي خطفت قلبي.. دوسي عشان تفتحي الجواب يا روحي.
              </p>

              <button
                onClick={handleOpenEnvelope}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-xl shadow-rose-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm text-glow"
              >
                <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
                <span>افتحي الجواب دلوقتي ✨</span>
              </button>
            </div>
          ) : (
            /* Unfolded Parchment Letter with Celebration Aura */
            <div className="relative bg-gradient-to-b from-[#1b0c26] to-[#12071a] border border-rose-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl box-glow max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-400">
              {/* Warm celebration glow aura behind parchment */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="إغلاق الرسالة"
                className="absolute top-3 left-3 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-rose-600 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Letter Header */}
              <div className="border-b border-rose-800/40 pb-3 sm:pb-4 mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 pl-8 sm:pl-10">
                <div>
                  <span className="text-[10px] sm:text-xs text-rose-400 block">كل سنة وأنتي طيبة يا حبيبة قلبي</span>
                  <h4 className="text-base sm:text-xl font-bold text-white flex items-center gap-1.5">
                    <span>لـ {partnerName}</span>
                    <span className="text-rose-500">❤️</span>
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {canEdit && onEditLetter && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onEditLetter();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/90 hover:bg-rose-800 border border-rose-600/50 text-amber-200 text-[11px] font-medium cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-amber-300" />
                      <span>تعديل الجواب</span>
                    </button>
                  )}

                  {/* Re-trigger celebration fireworks button */}
                  <button
                    type="button"
                    onClick={retriggerCelebration}
                    title="انثري الورد والنجوم الملونة تاني"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-rose-500/20 hover:from-amber-500/40 hover:to-rose-500/40 border border-amber-400/40 text-amber-200 text-[11px] font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                    <span>انثري الورد والنجوم ✨</span>
                  </button>
                </div>
              </div>

              {/* Romantic Letter Text */}
              <div className="font-poetry text-base sm:text-xl text-rose-100 leading-[2] sm:leading-[2.2] space-y-4 whitespace-pre-line">
                {messageBody}
              </div>

              {/* Letter Footer */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-rose-800/40 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-rose-300 text-xs sm:text-sm text-center sm:text-right">
                <span className="font-heading font-semibold text-white">
                  حبيبك: {senderName}
                </span>
                <span className="font-poetry text-[10px] sm:text-xs text-rose-400/80">
                  في كل سنة، حبك أنتي هو أحلى حاجة في حياتي
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
