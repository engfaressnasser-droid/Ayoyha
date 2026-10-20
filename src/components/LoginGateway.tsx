import React, { useState } from 'react';
import { Heart, Sparkles, Lock, ArrowRight, AlertCircle, Crown, Play, Pause } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

export interface UserSession {
  name: string;
  displayName: string;
  role: 'admin' | 'viewer';
}

interface LoginGatewayProps {
  onLogin: (session: UserSession) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  songTitle?: string;
  onUserGesture?: () => void;
  partnerName?: string;
  senderName?: string;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLogin,
  isPlaying = false,
  onTogglePlay,
  songTitle = 'عامر منيب - حب العمر 🎵',
  onUserGesture,
  partnerName = '',
  senderName = '',
}) => {
  const [inputName, setInputName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize Arabic letters and English strings for forgiving, friendly matching
  const normalize = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '');
  };

  const loginAsFaress = () => {
    onUserGesture?.();
    setIsSubmitting(true);
    romanticAudio.playCelebrationChime();
    setTimeout(() => {
      onLogin({
        name: 'Faress',
        displayName: 'فارس (حبيبك)',
        role: 'admin',
      });
    }, 250);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserGesture?.();
    setErrorMessage('');

    const raw = inputName.trim();
    if (!raw) {
      setErrorMessage('اكتبي اسمك يا قمر الأول عشان المفاجأة تنور بيكي 💕');
      return;
    }

    const norm = normalize(raw);
    const normPartner = normalize(partnerName);
    const normSender = normalize(senderName);

    // 1. Check for Faress / Sender (Admin / Creator)
    const isFaress =
      norm === 'faress' ||
      norm === 'fares' ||
      norm === 'فارس' ||
      norm === 'admin' ||
      norm === 'ادمن' ||
      norm.includes('faress') ||
      norm.includes('fares') ||
      norm.includes('فارس') ||
      (normSender.length >= 2 && norm.includes(normSender));

    if (isFaress) {
      loginAsFaress();
      return;
    }

    // 2. Check for ايويه or configured partnerName
    const isAyweya =
      norm === 'ايويه' ||
      norm === 'ايوه' ||
      norm === 'ايه' ||
      norm === 'ايويا' ||
      norm.startsWith('ايو') ||
      norm === 'aya' ||
      norm === 'ayweya' ||
      norm === 'ayoya' ||
      norm === 'ayota' ||
      (normPartner.length >= 2 && (norm.includes(normPartner) || normPartner.includes(norm)));

    if (isAyweya) {
      setIsSubmitting(true);
      romanticAudio.playCelebrationChime();
      setTimeout(() => {
        onLogin({
          name: 'ايويه',
          displayName: 'ايويه (ملكة اليوم 👑)',
          role: 'admin',
        });
      }, 250);
      return;
    }

    // 3. Any other non-empty name: allow entry with admin privileges so user is never locked out
    setIsSubmitting(true);
    romanticAudio.playCelebrationChime();
    setTimeout(() => {
      onLogin({
        name: raw,
        displayName: `${raw} 💖`,
        role: 'admin',
      });
    }, 250);
  };

  return (
    <div
      onClick={onUserGesture}
      className="min-h-screen relative flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-[#0b0612] text-[#fce7f3]"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-rose-600/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] bg-pink-600/12 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none" />

      {/* Decorative floating cute mini elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[10%] left-[10%] text-rose-400/30 text-xl sm:text-2xl animate-pulse">💖</span>
        <span className="absolute top-[18%] right-[12%] text-pink-300/25 text-2xl sm:text-3xl animate-bounce">✨</span>
        <span className="absolute bottom-[18%] left-[12%] text-rose-300/30 text-xl sm:text-2xl animate-pulse">🌸</span>
        <span className="absolute bottom-[22%] right-[10%] text-purple-300/25 text-xl sm:text-2xl animate-bounce">🎀</span>
      </div>

      <div className="relative z-10 max-w-md w-full my-auto">
        {/* Top Playing Music Banner Pill */}
        <div className="mb-3.5 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay?.();
            }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-rose-950/70 hover:bg-rose-900/80 border border-rose-700/50 text-xs text-rose-200 shadow-lg shadow-rose-950/60 transition-all cursor-pointer group"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-700/50 text-rose-200'}`}>
              {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current translate-x-[-0.5px]" />}
            </div>
            <span className="font-medium text-[11px] text-rose-200">
              {songTitle}
            </span>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-2 w-2.5 mr-0.5">
                <span className="w-0.5 bg-rose-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
                <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-2/3" />
                <span className="w-0.5 bg-rose-300 rounded-full animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-4/5" />
              </div>
            )}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-[#140a1e]/95 border border-rose-700/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-rose-950/90 backdrop-blur-xl text-center relative overflow-hidden box-glow">
          {/* Subtle top shimmer bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-75" />

          {/* Top Heart Badge with Cute Sparkles */}
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-rose-500/25 rounded-full blur-md animate-pulse" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-500 border border-rose-300/50 flex items-center justify-center shadow-lg shadow-rose-900/60">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white/95 animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-amber-950 shadow">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Heading with Dal'aa */}
          <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-[11px] sm:text-xs font-semibold tracking-wider">
              <Sparkles className="w-3 h-3 text-pink-300 animate-spin" />
              <span>مفاجأة مخصوص لست البنات ودلوعتي 👑</span>
              <Sparkles className="w-3 h-3 text-pink-300 animate-spin" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              بوابة حكايتنا وسر فرحتنا 💌
            </h1>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed font-poetry px-2">
              المكان ده معمول بحب ومتقفل بمفتاح سري في قلبي لأغلى بنوتة في الدنيا..
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
            <div>
              <label htmlFor="loginName" className="block text-xs sm:text-sm font-semibold text-rose-300 mb-2 flex items-center justify-between">
                <span>اكتبي اسمك يا روح قلبي: 💕</span>
                <span className="text-[11px] text-pink-400/70 font-normal">✨ مستني ضحكتك</span>
              </label>
              <div className="relative">
                <input
                  id="loginName"
                  type="text"
                  autoFocus
                  value={inputName}
                  onFocus={onUserGesture}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="اكتبي اسمك يا حتة السكر... 🌸"
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-neutral-900/90 border border-rose-800/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 text-base text-white placeholder:text-rose-400/50 text-center font-medium focus:outline-none transition-all shadow-inner hover:border-rose-600/70"
                />
              </div>
            </div>

            {/* Error / Hint Notification with Dal'aa */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 sm:p-3.5 rounded-2xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-xs leading-relaxed animate-in fade-in duration-200 text-right">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-950/70 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 text-glow"
            >
              {isSubmitting ? (
                <span>ثواني يا روحي.. البوابة بتفتح بحب! ✨</span>
              ) : (
                <>
                  <span>افتحي مفاجأتك يا عيوني 💖</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Quick Admin Access for Faress on Mobile & Desktop */}
          <div className="mt-4 pt-3 border-t border-rose-900/30 flex items-center justify-center">
            <button
              type="button"
              onClick={loginAsFaress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-200 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>دخول سريع لفارس (التحكم والتعديل) 👑</span>
            </button>
          </div>

          {/* Sweet Romantic Footer */}
          <div className="mt-4 pt-3 text-[11px] sm:text-xs text-rose-300/75 flex flex-col gap-1 items-center font-poetry">
            <span>معمول بكل حب وشوق عشان أحلى ضحكة في الدنيا ❤️</span>
          </div>
        </div>
      </div>
    </div>
  );
};
