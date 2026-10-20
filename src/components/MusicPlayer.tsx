import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  customSongUrl?: string;
  customSongTitle?: string;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onOpenCustomizer?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  customSongTitle = 'عامر منيب - حب العمر 🎵',
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Play/Pause Button */}
      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'إيقاف الأغنية مؤقتاً' : 'تشغيل الأغنية'}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs transition-all active:scale-95 cursor-pointer ${
          isPlaying
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/50'
            : 'bg-rose-950/30 border-rose-800/30 text-rose-300 hover:bg-rose-900/50'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-600/40 text-rose-300'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current translate-x-[-1px]" />
          )}
        </div>

        <div className="hidden sm:flex flex-col text-right leading-none max-w-[130px] md:max-w-[180px]">
          <span className="text-[11px] font-semibold text-rose-200 truncate">
            {customSongTitle}
          </span>
          <span className="text-[9px] text-rose-300/60 mt-0.5">
            {isPlaying ? 'شغالة الآن 🎶' : 'تشغيل الأغنية'}
          </span>
        </div>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-2.5 w-3 mr-0.5">
            <span className="w-0.5 bg-rose-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
            <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-2/3" />
            <span className="w-0.5 bg-rose-300 rounded-full animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-4/5" />
          </div>
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
        className="text-rose-300/70 hover:text-white p-1.5 rounded-full hover:bg-rose-950/40 transition-colors cursor-pointer"
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
