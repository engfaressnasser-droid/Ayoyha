import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Calendar, ArrowDown, Clock, Cake, Crown, Edit3 } from 'lucide-react';
import { UserSession } from './LoginGateway';

interface HeroSectionProps {
  partnerName: string;
  senderName: string;
  birthDate?: string;
  anniversaryDate?: string;
  headline: string;
  subtitle?: string;
  kickerText?: string;
  openLetterButtonText?: string;
  timeTogetherTitle?: string;
  timeTogetherSubtitle?: string;
  timeTogetherLabel?: string;
  timeTogetherPoem?: string;
  countdownTitle?: string;
  countdownPoem?: string;
  onOpenLetter: () => void;
  userSession?: UserSession | null;
  onEditSection?: (tab: 'basic' | 'hero' | 'letters' | 'reasons' | 'gallery' | 'cake' | 'music' | 'footer') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  partnerName,
  senderName,
  birthDate = '2007-10-20',
  anniversaryDate = '2026-07-21',
  headline,
  subtitle,
  kickerText = 'حكايتنا الحلوة',
  openLetterButtonText = 'افتحي الجواب بتاعي ليكي 💌',
  timeTogetherTitle = 'بقالنا كام يوم نعرف بعض',
  timeTogetherSubtitle = 'من يوم ما نورتي حياتي ودنيتي ❤️',
  timeTogetherLabel = 'يوم حب وعشق وسعادة 💕',
  timeTogetherPoem = 'وكل ثانية بتعدي مكانتك بتكبر في قلبي أكتر من الأول ❤️',
  countdownTitle = 'العد التنازلي لعيد ميلادك',
  countdownPoem = 'بنعد اللحظات بالثانية عشان نحتفل بأجمل يوم في السنة كلها ✨',
  onOpenLetter,
  userSession,
  onEditSection,
}) => {
  // Live ticking counter for time spent together
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Birthday countdown state
  const [bdayCountdown, setBdayCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
    turningAge: 19,
  });

  // Safe localized date formatters in Egyptian Arabic
  const formatMeetingDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const monthsAr = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      if (day && month && monthsAr[month - 1]) {
        return `${day} ${monthsAr[month - 1]} ${year || ''}`.trim();
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formattedAnniversary = formatMeetingDate(anniversaryDate);
  const formattedBirthday = formatMeetingDate(birthDate);

  useEffect(() => {
    const parseLocalMidnight = (dateString: string) => {
      if (!dateString) return new Date();
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0, 0);
      }
      return new Date(dateString);
    };

    const updateLoveCounter = () => {
      const now = new Date();
      const start = parseLocalMidnight(anniversaryDate);

      // Total difference in milliseconds
      let diffMs = Math.abs(now.getTime() - start.getTime());

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diffMs -= days * (1000 * 60 * 60 * 24);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      diffMs -= hours * (1000 * 60 * 60);

      const minutes = Math.floor(diffMs / (1000 * 60));
      diffMs -= minutes * (1000 * 60);

      const seconds = Math.floor(diffMs / 1000);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    const updateBirthdayCountdown = () => {
      const now = new Date();
      const bday = parseLocalMidnight(birthDate);
      const currentYear = now.getFullYear();

      // Check if today is the birthday
      const isToday =
        now.getMonth() === bday.getMonth() &&
        now.getDate() === bday.getDate();

      // Calculate target birthday
      let targetBday = new Date(currentYear, bday.getMonth(), bday.getDate(), 0, 0, 0, 0);
      if (now.getTime() > targetBday.getTime() && !isToday) {
        targetBday = new Date(currentYear + 1, bday.getMonth(), bday.getDate(), 0, 0, 0, 0);
      }

      // Age calculation
      const birthYear = bday.getFullYear() || 2007;
      const turningAge = targetBday.getFullYear() - birthYear;

      const diffMs = Math.max(0, targetBday.getTime() - now.getTime());
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setBdayCountdown({
        days,
        hours,
        minutes,
        seconds,
        isToday,
        turningAge: turningAge || 19,
      });
    };

    updateLoveCounter();
    updateBirthdayCountdown();

    const interval = setInterval(() => {
      updateLoveCounter();
      updateBirthdayCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [anniversaryDate, birthDate]);

  return (
    <section id="top" className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center px-3 sm:px-6 pt-14 sm:pt-24 pb-12 sm:pb-20 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px] bg-rose-600/15 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[220px] sm:w-[350px] h-[220px] sm:h-[350px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center w-full">
        {/* Personalized Welcome Banner for Ayweya */}
        {userSession?.role === 'viewer' && (
          <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-950/90 via-pink-950/80 to-rose-950/90 border border-rose-500/50 shadow-xl shadow-rose-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
            <Crown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span className="text-[11px] sm:text-sm font-semibold text-pink-200">
              نورتي عالمك السري يا أيويه 🌸 كل سنة وأنتي ضحكة قلب فارس وعمره كله!
            </span>
            <Sparkles className="w-3 h-3 text-pink-300" />
          </div>
        )}

        {/* Subtle romantic unboxed kicker */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-rose-400 text-[11px] sm:text-sm font-medium tracking-wider mb-3 sm:mb-6">
          <span>عيد ميلاد قمري</span>
          <span aria-hidden="true">·</span>
          <span>{formattedBirthday}</span>
          <span aria-hidden="true">·</span>
          <span>أول ما اتعرفنا {formattedAnniversary}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-rose-300">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
            <span>{kickerText}</span>
          </span>
          {onEditSection && (
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => onEditSection('basic')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 hover:bg-rose-900 text-amber-200 text-xs font-sans transition-all cursor-pointer border border-rose-600/50 shadow"
                title="تعديل الأسماء والتواريخ"
              >
                <Edit3 className="w-3 h-3 text-amber-300" />
                <span>تعديل الأسماء والتواريخ</span>
              </button>
              <button
                type="button"
                onClick={() => onEditSection('hero')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 hover:bg-rose-900 text-amber-200 text-xs font-sans transition-all cursor-pointer border border-rose-600/50 shadow"
                title="تعديل عناوين ونصوص وعدادات البداية"
              >
                <Edit3 className="w-3 h-3 text-amber-300" />
                <span>تعديل الواجهة</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Emotional Headline in Egyptian Arabic */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white mb-3 sm:mb-6 leading-tight max-w-3xl [text-wrap:balance]">
          <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent text-glow">
            {headline}
          </span>
          <span className="block mt-1 sm:mt-2 text-rose-200 text-xl sm:text-3xl md:text-5xl">
            يا {partnerName || 'حبيبة قلبي'} ❤️
          </span>
        </h1>

        {/* Poetic Subtitle in Egyptian Arabic */}
        <p className="text-xs sm:text-base md:text-xl text-rose-200/80 font-poetry max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-8 [text-wrap:balance] px-1 sm:px-2">
          {subtitle}
        </p>

        {/* ============================================================== */}
        {/* DUAL INTERACTIVE HERO CARDS: بقالنا كام يوم نعرف بعض + العد التنازلي */}
        {/* ============================================================== */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mb-5 sm:mb-8 text-right">
          {/* Card 1: بقالنا كام يوم نعرف بعض */}
          <div className="relative bg-gradient-to-b from-[#1b0d29]/95 via-[#140821]/95 to-[#0e0417]/95 border border-rose-500/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 backdrop-blur-md shadow-2xl box-glow flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-800/40 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-white tracking-wide">
                      {timeTogetherTitle}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-rose-300/70 block truncate max-w-[170px] sm:max-w-none">
                      {timeTogetherSubtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onEditSection && (
                    <button
                      type="button"
                      onClick={() => onEditSection('basic')}
                      title="تعديل التاريخ"
                      className="p-1.5 rounded-full bg-rose-950/90 hover:bg-rose-800 border border-rose-600/50 text-amber-300 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-700/50 text-[10px] sm:text-[11px] text-pink-300 font-mono shrink-0">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    <span>{formattedAnniversary}</span>
                  </div>
                </div>
              </div>

              {/* Prominent Day Count Banner */}
              <div className="text-center py-2 mb-3.5 bg-rose-950/30 rounded-2xl border border-rose-800/20">
                <div className="inline-flex items-baseline gap-1.5 sm:gap-2">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-black text-white text-glow tabular-nums">
                    {timeTogether.days}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-rose-300">
                    {timeTogetherLabel}
                  </span>
                </div>
              </div>

              {/* 4-Unit Live Real-Time Ticking Counter (responsive on mobile) */}
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                {/* Days */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-800/30 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner">
                  <span className="font-mono text-base sm:text-2xl font-bold text-white tabular-nums tracking-tight">
                    {timeTogether.days}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-rose-300/80 font-medium mt-0.5">
                    أيام
                  </span>
                </div>

                {/* Hours */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-800/30 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner">
                  <span className="font-mono text-base sm:text-2xl font-bold text-rose-200 tabular-nums tracking-tight">
                    {String(timeTogether.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-rose-300/80 font-medium mt-0.5">
                    ساعات
                  </span>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-800/30 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner">
                  <span className="font-mono text-base sm:text-2xl font-bold text-pink-300 tabular-nums tracking-tight">
                    {String(timeTogether.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-rose-300/80 font-medium mt-0.5">
                    دقائق
                  </span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-500/40 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner ring-1 ring-rose-500/20">
                  <span className="font-mono text-base sm:text-2xl font-bold text-rose-400 tabular-nums tracking-tight animate-pulse text-glow">
                    {String(timeTogether.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-rose-300/80 font-medium mt-0.5">
                    ثواني
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-rose-900/30 text-center">
              <span className="text-[10px] sm:text-[11px] text-rose-300/70 font-poetry leading-tight block">
                {timeTogetherPoem}
              </span>
            </div>
          </div>

          {/* Card 2: العد التنازلي لعيد ميلادك */}
          <div className="relative bg-gradient-to-b from-[#1b0d29]/95 via-[#140821]/95 to-[#0e0417]/95 border border-amber-500/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 backdrop-blur-md shadow-2xl box-glow-gold flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/40 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-white tracking-wide">
                      {countdownTitle}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-amber-200/70 block truncate max-w-[170px] sm:max-w-none">
                      {bdayCountdown.isToday ? '🎉 النهاردة عيد ميلادك يا روحي!' : `فاضل قد إيه على سنتك الـ ${bdayCountdown.turningAge}؟ ✨`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-[10px] sm:text-[11px] text-amber-300 font-mono shrink-0">
                  <Cake className="w-3 h-3 text-amber-400" />
                  <span>{formattedBirthday}</span>
                </div>
              </div>

              {/* Status Banner */}
              {bdayCountdown.isToday ? (
                <div className="text-center py-2 mb-3.5 bg-gradient-to-r from-amber-950/60 to-rose-950/60 rounded-2xl border border-amber-500/40">
                  <span className="text-xs sm:text-sm font-bold text-amber-200 animate-pulse block">
                    🎂 كل سنة وأنتي طيبة يا ست البنات! عيد ميلاد سعيد 🎉
                  </span>
                  <span className="text-[10px] text-pink-300/80 mt-0.5 block">
                    العد التنازلي لسنتك القادمة شغال باستمرار ✨
                  </span>
                </div>
              ) : (
                <div className="text-center py-2 mb-3.5 bg-amber-950/30 rounded-2xl border border-amber-800/20">
                  <div className="inline-flex items-baseline gap-1.5 sm:gap-2">
                    <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-black text-amber-100 text-glow tabular-nums">
                      {bdayCountdown.days}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-amber-300">
                      يوم متبقي على الحفلة الكبيرة ✨
                    </span>
                  </div>
                </div>
              )}

              {/* 4-Unit Live Countdown Numbers (responsive on mobile) */}
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                {/* Days */}
                <div className="flex flex-col items-center bg-black/40 border border-amber-800/30 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner">
                  <span className="font-mono text-base sm:text-2xl font-bold text-white tabular-nums tracking-tight">
                    {bdayCountdown.days}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-amber-300/80 font-medium mt-0.5">
                    أيام
                  </span>
                </div>

                {/* Hours */}
                <div className="flex flex-col items-center bg-black/40 border border-amber-800/30 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner">
                  <span className="font-mono text-base sm:text-2xl font-bold text-amber-200 tabular-nums tracking-tight">
                    {String(bdayCountdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-amber-300/80 font-medium mt-0.5">
                    ساعات
                  </span>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center bg-black/40 border border-amber-800/30 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner">
                  <span className="font-mono text-base sm:text-2xl font-bold text-yellow-300 tabular-nums tracking-tight">
                    {String(bdayCountdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-amber-300/80 font-medium mt-0.5">
                    دقائق
                  </span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center bg-black/40 border border-amber-500/40 rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3 shadow-inner ring-1 ring-amber-500/20">
                  <span className="font-mono text-base sm:text-2xl font-bold text-amber-400 tabular-nums tracking-tight animate-pulse text-glow">
                    {String(bdayCountdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-amber-300/80 font-medium mt-0.5">
                    ثواني
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-amber-900/30 text-center">
              <span className="text-[10px] sm:text-[11px] text-amber-200/70 font-poetry leading-tight block">
                {countdownPoem}
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated wide Love Letter button placed standalone under the counters */}
        <div className="w-full max-w-4xl flex justify-center mb-5 sm:mb-8 px-0 sm:px-1">
          <button
            onClick={onOpenLetter}
            className="w-full max-w-2xl py-3.5 sm:py-4 px-4 sm:px-8 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:via-pink-500 hover:to-rose-500 text-white text-sm sm:text-base md:text-lg font-bold rounded-2xl sm:rounded-3xl shadow-xl shadow-rose-900/60 hover:shadow-rose-600/70 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer border border-rose-400/40 flex items-center justify-center gap-2.5 sm:gap-3 text-glow"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white animate-pulse" />
            <span>{openLetterButtonText}</span>
          </button>
        </div>

        {/* Gentle scroll indicator */}
        <a
          href="#message"
          aria-label="انزلي للجواب"
          className="mt-2 text-rose-400/60 hover:text-rose-300 transition-colors flex flex-col items-center gap-1.5"
        >
          <span className="text-[11px] sm:text-xs">انزلي لتحت عشان تقري الجواب الحلو</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
