import React from 'react';
import { Settings2, Crown, LogOut, Eye } from 'lucide-react';
import { MusicPlayer } from './MusicPlayer';
import { UserSession } from './LoginGateway';

interface NavbarProps {
  partnerName: string;
  onOpenCustomizer: () => void;
  customSongUrl?: string;
  customSongTitle?: string;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  userSession?: UserSession | null;
  onLogout?: () => void;
  isPreviewingAsViewer?: boolean;
  onTogglePreview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCustomizer,
  customSongUrl,
  customSongTitle,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  userSession,
  onLogout,
  isPreviewingAsViewer,
  onTogglePreview,
}) => {
  const isAdmin = userSession?.role === 'admin' && !isPreviewingAsViewer;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-rose-950/40 bg-[#0b0612]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6 py-2 sm:py-3">
        {/* Zone 1: Wordmark & User Role Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <a
            href="#top"
            className="text-xs sm:text-base md:text-lg font-bold tracking-wide text-rose-200 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500 animate-pulse" />
            <span>حكايتنا سوا</span>
          </a>

          {/* User Role Tag */}
          {userSession && (
            <div className="hidden xs:flex items-center text-[10px] sm:text-[11px] font-medium transition-all">
              {isAdmin ? (
                <span className="flex items-center gap-1 text-amber-300 bg-amber-950/50 border border-amber-600/40 px-2 py-0.5 rounded-full">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>فارس 👑</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-pink-300 bg-pink-950/50 border border-pink-600/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  <span>أيويه 🌸 (زائر)</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-rose-200/70">
          <a
            href="#message"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            رسالتي ليكي
          </a>
          <a
            href="#gallery"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            ذكرياتنا الحلوة
          </a>
          <a
            href="#reasons"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            ليه بحبك
          </a>
          <a
            href="#wish"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            شمعة وأمنية
          </a>
        </nav>

        {/* Zone 3: Actions (Music player + Edit Button (Admin Only) + Preview + Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <MusicPlayer
            customSongUrl={customSongUrl}
            customSongTitle={customSongTitle}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onTogglePlay={onTogglePlay}
            onToggleMute={onToggleMute}
            onOpenCustomizer={isAdmin ? onOpenCustomizer : undefined}
          />

          {/* Edit Button: ONLY visible for Faress (Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenCustomizer}
              title="تعديل محتوى وبيانات الموقع (فارس)"
              aria-label="تعديل الموقع"
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 border border-amber-300/40 rounded-full sm:rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-md shadow-rose-950/60 active:scale-95"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-200" />
              <span>تعديل الموقع</span>
            </button>
          )}

          {/* Quick Preview Toggle: ONLY for Faress (Admin) */}
          {userSession?.role === 'admin' && onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              title={isPreviewingAsViewer ? 'الرجوع لوضع التعديل (فارس)' : 'معاينة كما تراه أيويه'}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-purple-200 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/40 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>{isPreviewingAsViewer ? 'وضع التعديل' : 'معاينة'}</span>
            </button>
          )}

          {/* Logout / Switch Role button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="تسجيل الخروج أو تبديل الحساب"
              aria-label="تسجيل الخروج"
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-rose-300/80 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/30 rounded-full sm:rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
