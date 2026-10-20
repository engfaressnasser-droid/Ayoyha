import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Heart,
  Music,
  Calendar,
  User,
  UploadCloud,
  Trash2,
  CheckCircle2,
  Type,
  Mail,
  Cake,
  Flame,
  Plus,
  Smile,
  Sun,
  Shield,
  Eye,
  Gift,
  Sparkles,
  Camera,
  Layers,
  MessageCircle,
  Download,
  Upload,
} from 'lucide-react';
import { BirthdayConfig, LoveReason, MemoryImage } from '../types';
import { saveCustomAudio } from '../utils/audioStorage';

export type CustomizerTab =
  | 'basic'
  | 'hero'
  | 'letters'
  | 'reasons'
  | 'gallery'
  | 'cake'
  | 'music'
  | 'footer'
  | 'backup';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (updated: BirthdayConfig) => void;
  onResetDefaults: () => void;
  initialTab?: CustomizerTab;
  uploadedAudioUrl?: string | null;
  uploadedAudioName?: string;
  onAudioUploaded?: (audioUrl: string, fileName: string) => void;
  onAudioRemoved?: () => Promise<void>;
  memories?: MemoryImage[];
  onImportBackup?: (config: BirthdayConfig, memories?: MemoryImage[]) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
  initialTab = 'basic',
  uploadedAudioUrl,
  uploadedAudioName,
  onAudioUploaded,
  onAudioRemoved,
  memories = [],
  onImportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>(initialTab);

  // Tab 1: Names & Dates
  const [partnerName, setPartnerName] = useState(config.partnerName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [birthDate, setBirthDate] = useState(config.birthDate || '2007-10-20');
  const [anniversaryDate, setAnniversaryDate] = useState(config.anniversaryDate || '2026-07-21');

  // Tab 2: Hero texts & Counters
  const [mainHeadline, setMainHeadline] = useState(config.mainHeadline || 'كل سنة وأنتي أجمل حاجة في حياتي');
  const [subtitle, setSubtitle] = useState(
    config.subtitle ||
      'النهاردة مش يوم عادي أبداً.. النهاردة بنحتفل بأجمل ضحكة وأطيب قلب في الدنيا، اليوم اللي اتولدت فيه أميرتي ونور عيني.'
  );
  const [kickerText, setKickerText] = useState(config.kickerText || 'حكايتنا الحلوة');
  const [openLetterButtonText, setOpenLetterButtonText] = useState(
    config.openLetterButtonText || 'افتحي الجواب بتاعي ليكي 💌'
  );
  const [timeTogetherTitle, setTimeTogetherTitle] = useState(
    config.timeTogetherTitle || 'بقالنا كام يوم نعرف بعض'
  );
  const [timeTogetherSubtitle, setTimeTogetherSubtitle] = useState(
    config.timeTogetherSubtitle || 'من يوم ما نورتي حياتي ودنيتي ❤️'
  );
  const [timeTogetherLabel, setTimeTogetherLabel] = useState(
    config.timeTogetherLabel || 'يوم حب وعشق وسعادة 💕'
  );
  const [timeTogetherPoem, setTimeTogetherPoem] = useState(
    config.timeTogetherPoem || 'وكل ثانية بتعدي مكانتك بتكبر في قلبي أكتر من الأول ❤️'
  );
  const [countdownTitle, setCountdownTitle] = useState(
    config.countdownTitle || 'العد التنازلي لعيد ميلادك'
  );
  const [countdownPoem, setCountdownPoem] = useState(
    config.countdownPoem || 'بنعد اللحظات بالثانية عشان نحتفل بأجمل يوم في السنة كلها ✨'
  );

  // Tab 3: Letters
  const [envelopeLetterBody, setEnvelopeLetterBody] = useState(config.envelopeLetterBody || '');
  const [loveMessageTitle, setLoveMessageTitle] = useState(config.loveMessageTitle || 'جواب حب لست البنات');
  const [loveMessageBody, setLoveMessageBody] = useState(config.loveMessageBody || '');
  const [loveVerseText, setLoveVerseText] = useState(
    config.loveVerseText ||
      `"يا بخت عيني اللي شافت ضحكتك..
ويا سعد قلبي اللي أنتي نصيبه وفرحته!"`
  );

  // Tab 4: Reasons Why
  const [reasonsTitle, setReasonsTitle] = useState(config.reasonsTitle || 'ليه بحبك وبموت فيكي؟');
  const [reasonsSubtitle, setReasonsSubtitle] = useState(
    config.reasonsSubtitle || 'أسرار بيني وبينك · من بين ألف سبب وسبب'
  );
  const [reasonsWhy, setReasonsWhy] = useState<LoveReason[]>(config.reasonsWhy || []);

  // Tab 5: Gallery Section Texts
  const [galleryTitle, setGalleryTitle] = useState(
    config.galleryTitle || 'معرض صورنا وذكرياتنا الحلوة'
  );
  const [gallerySubtitle, setGallerySubtitle] = useState(
    config.gallerySubtitle || 'ألبوم حكاياتنا وسنين حبنا'
  );

  // Tab 6: Cake & Candle
  const [wishSectionTitle, setWishSectionTitle] = useState(
    config.wishSectionTitle || 'طفي الشمعة واتمني أمنية من قلبك'
  );
  const [wishSectionSubtitle, setWishSectionSubtitle] = useState(
    config.wishSectionSubtitle || 'احتفالنا بسنتك الجديدة · أمنيات من كل القلب'
  );
  const [cakeMessage, setCakeMessage] = useState(config.cakeMessage || '');
  const [wishMessageBody, setWishMessageBody] = useState(
    config.wishMessageBody ||
      'يا رب يجعل أيامك الجاية كلها سكر زي قلبك، ويفرح روحك وما يوريني فيكي أي حاجة وحشة أبداً، وتفضلي منورة حياتي ومحليّاها دايماً يا أجمل حظ في عمري.'
  );

  // Tab 7: Audio upload state
  const [customSongTitle, setCustomSongTitle] = useState(config.customSongTitle);
  const [customSongUrl, setCustomSongUrl] = useState(config.customSongUrl || '');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [currentUploadedName, setCurrentUploadedName] = useState<string>(uploadedAudioName || '');

  // Tab 8: Footer
  const [footerLoveText, setFooterLoveText] = useState(
    config.footerLoveText || 'اتعملت بكل حب عشان عيون'
  );
  const [footerSubtext, setFooterSubtext] = useState(
    config.footerSubtext || 'كل ثانية، وكل دقيقة، وكل سنة.. وأنتي أجمل نعمة في حياتي ومنورة دنيتي كلها.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync activeTab when modal opens on a specific section tab
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Sync all form fields with latest config whenever modal opens or config updates
  useEffect(() => {
    if (isOpen) {
      setPartnerName(config.partnerName || '');
      setSenderName(config.senderName || '');
      setBirthDate(config.birthDate || '2007-10-20');
      setAnniversaryDate(config.anniversaryDate || '2026-07-21');
      setMainHeadline(config.mainHeadline || 'كل سنة وأنتي أجمل حاجة في حياتي');
      setSubtitle(
        config.subtitle ||
          'النهاردة مش يوم عادي أبداً.. النهاردة بنحتفل بأجمل ضحكة وأطيب قلب في الدنيا، اليوم اللي اتولدت فيه أميرتي ونور عيني.'
      );
      setKickerText(config.kickerText || 'حكايتنا الحلوة');
      setOpenLetterButtonText(config.openLetterButtonText || 'افتحي الجواب بتاعي ليكي 💌');
      setTimeTogetherTitle(config.timeTogetherTitle || 'بقالنا كام يوم نعرف بعض');
      setTimeTogetherSubtitle(config.timeTogetherSubtitle || 'من يوم ما نورتي حياتي ودنيتي ❤️');
      setTimeTogetherLabel(config.timeTogetherLabel || 'يوم حب وعشق وسعادة 💕');
      setTimeTogetherPoem(
        config.timeTogetherPoem || 'وكل ثانية بتعدي مكانتك بتكبر في قلبي أكتر من الأول ❤️'
      );
      setCountdownTitle(config.countdownTitle || 'العد التنازلي لعيد ميلادك');
      setCountdownPoem(
        config.countdownPoem || 'بنعد اللحظات بالثانية عشان نحتفل بأجمل يوم في السنة كلها ✨'
      );
      setEnvelopeLetterBody(config.envelopeLetterBody || '');
      setLoveMessageTitle(config.loveMessageTitle || 'جواب حب لست البنات');
      setLoveMessageBody(config.loveMessageBody || '');
      setLoveVerseText(
        config.loveVerseText ||
          `"يا بخت عيني اللي شافت ضحكتك..\nويا سعد قلبي اللي أنتي نصيبه وفرحته!"`
      );
      setReasonsTitle(config.reasonsTitle || 'ليه بحبك وبموت فيكي؟');
      setReasonsSubtitle(config.reasonsSubtitle || 'أسرار بيني وبينك · من بين ألف سبب وسبب');
      setReasonsWhy(config.reasonsWhy || []);
      setGalleryTitle(config.galleryTitle || 'معرض صورنا وذكرياتنا الحلوة');
      setGallerySubtitle(config.gallerySubtitle || 'ألبوم حكاياتنا وسنين حبنا');
      setWishSectionTitle(config.wishSectionTitle || 'طفي الشمعة واتمني أمنية من قلبك');
      setWishSectionSubtitle(
        config.wishSectionSubtitle || 'احتفالنا بسنتك الجديدة · أمنيات من كل القلب'
      );
      setCakeMessage(config.cakeMessage || '');
      setWishMessageBody(
        config.wishMessageBody ||
          'يا رب يجعل أيامك الجاية كلها سكر زي قلبك، ويفرح روحك وما يوريني فيكي أي حاجة وحشة أبداً، وتفضلي منورة حياتي ومحليّاها دايماً يا أجمل حظ في عمري.'
      );
      setCustomSongTitle(config.customSongTitle || '');
      setCustomSongUrl(config.customSongUrl || '/music/hobb-al-omr.mp3');
      setFooterLoveText(config.footerLoveText || 'اتعملت بكل حب عشان عيون');
      setFooterSubtext(
        config.footerSubtext ||
          'كل ثانية، وكل دقيقة، وكل سنة.. وأنتي أجمل نعمة في حياتي ومنورة دنيتي كلها.'
      );
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAudioFile(file);
    setCurrentUploadedName(file.name);

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
    if (!customSongTitle || customSongTitle.includes('أغنيتنا الحلوة') || customSongTitle.trim() === '') {
      setCustomSongTitle(cleanTitle);
    }

    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
    }
    const newPreview = URL.createObjectURL(file);
    setPreviewAudioUrl(newPreview);
  };

  const handleRemoveAudio = async () => {
    setSelectedAudioFile(null);
    setCurrentUploadedName('');
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
      setPreviewAudioUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onAudioRemoved) {
      await onAudioRemoved();
    }
  };

  const handleAddReason = () => {
    const newId = reasonsWhy.length > 0 ? Math.max(...reasonsWhy.map((r) => r.id)) + 1 : 1;
    const newReason: LoveReason = {
      id: newId,
      icon: 'heart',
      title: 'سبب جديد بحبك علشانه',
      description: 'اكتب هنا تفاصيل وسبب حبك ليها...',
    };
    setReasonsWhy([...reasonsWhy, newReason]);
  };

  const handleUpdateReason = (index: number, updatedField: Partial<LoveReason>) => {
    const updated = [...reasonsWhy];
    updated[index] = { ...updated[index], ...updatedField };
    setReasonsWhy(updated);
  };

  const handleDeleteReason = (id: number) => {
    setReasonsWhy(reasonsWhy.filter((r) => r.id !== id));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setIsSaving(true);

    try {
      if (selectedAudioFile) {
        try {
          await saveCustomAudio(selectedAudioFile, selectedAudioFile.name);
        } catch (audioErr) {
          console.warn('Audio IndexedDB fallback:', audioErr);
        }
        const newUrl = URL.createObjectURL(selectedAudioFile);
        onAudioUploaded?.(newUrl, selectedAudioFile.name);
      }

      onSaveConfig({
        ...config,
        partnerName: partnerName.trim() || 'حبيبتي',
        senderName: senderName.trim() || 'حبيبكِ',
        birthDate: birthDate || '2007-10-20',
        anniversaryDate: anniversaryDate || '2026-07-21',

        // Hero & counters
        mainHeadline: mainHeadline.trim() || 'كل سنة وأنتي أجمل حاجة في حياتي',
        subtitle: subtitle.trim(),
        kickerText: kickerText.trim() || 'حكايتنا الحلوة',
        openLetterButtonText: openLetterButtonText.trim() || 'افتحي الجواب بتاعي ليكي 💌',
        timeTogetherTitle: timeTogetherTitle.trim() || 'بقالنا كام يوم نعرف بعض',
        timeTogetherSubtitle: timeTogetherSubtitle.trim(),
        timeTogetherLabel: timeTogetherLabel.trim() || 'يوم حب وعشق وسعادة 💕',
        timeTogetherPoem: timeTogetherPoem.trim(),
        countdownTitle: countdownTitle.trim() || 'العد التنازلي لعيد ميلادك',
        countdownPoem: countdownPoem.trim(),

        // Letters
        loveMessageTitle: loveMessageTitle.trim() || 'جواب حب لست البنات',
        loveMessageBody: loveMessageBody.trim(),
        loveVerseText: loveVerseText.trim(),
        envelopeLetterBody: envelopeLetterBody.trim(),

        // Reasons
        reasonsTitle: reasonsTitle.trim() || 'ليه بحبك وبموت فيكي؟',
        reasonsSubtitle: reasonsSubtitle.trim(),
        reasonsWhy,

        // Gallery
        galleryTitle: galleryTitle.trim() || 'معرض صورنا وذكرياتنا الحلوة',
        gallerySubtitle: gallerySubtitle.trim(),

        // Cake & Wish
        wishSectionTitle: wishSectionTitle.trim() || 'طفي الشمعة واتمني أمنية من قلبك',
        wishSectionSubtitle: wishSectionSubtitle.trim(),
        wishMessageBody: wishMessageBody.trim(),
        cakeMessage: cakeMessage.trim(),

        // Music
        customSongTitle:
          customSongTitle.trim() ||
          (selectedAudioFile
            ? selectedAudioFile.name.replace(/\.[^/.]+$/, '')
            : 'أغنيتنا الحلوة اللي بنحبها'),
        customSongUrl: customSongUrl.trim(),

        // Footer
        footerLoveText: footerLoveText.trim() || 'اتعملت بكل حب عشان عيون',
        footerSubtext: footerSubtext.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const currentConfigSnapshot: BirthdayConfig = {
      ...config,
      partnerName,
      senderName,
      birthDate,
      anniversaryDate,
      mainHeadline,
      subtitle,
      kickerText,
      openLetterButtonText,
      timeTogetherTitle,
      timeTogetherSubtitle,
      timeTogetherLabel,
      timeTogetherPoem,
      countdownTitle,
      countdownPoem,
      loveMessageTitle,
      loveMessageBody,
      loveVerseText,
      envelopeLetterBody,
      reasonsTitle,
      reasonsSubtitle,
      reasonsWhy,
      galleryTitle,
      gallerySubtitle,
      wishSectionTitle,
      wishSectionSubtitle,
      wishMessageBody,
      cakeMessage,
      customSongTitle,
      customSongUrl,
      footerLoveText,
      footerSubtext,
    };

    const backupData = {
      version: 1,
      createdAt: new Date().toISOString(),
      config: currentConfigSnapshot,
      memories: memories || [],
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `romantic-bday-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedConfig = parsed.config || parsed;
        if (importedConfig && typeof importedConfig === 'object') {
          onSaveConfig(importedConfig);
          if (parsed.memories && onImportBackup) {
            onImportBackup(importedConfig, parsed.memories);
          }
          onClose();
        }
      } catch {
        console.error('Failed to parse backup');
      }
    };
    reader.readAsText(file);
  };

  const activeAudioPreview = previewAudioUrl || uploadedAudioUrl;
  const hasActiveAudioFile = !!(selectedAudioFile || currentUploadedName);

  const tabs = [
    { id: 'basic' as CustomizerTab, label: 'الأسماء والتواريخ', icon: User },
    { id: 'hero' as CustomizerTab, label: 'الواجهة والعدادات', icon: Type },
    { id: 'letters' as CustomizerTab, label: 'رسائل الحب', icon: Mail },
    { id: 'reasons' as CustomizerTab, label: 'أسباب حبي ليكي', icon: Heart },
    { id: 'gallery' as CustomizerTab, label: 'معرض الصور', icon: Camera },
    { id: 'cake' as CustomizerTab, label: 'الشمعة والتورتة', icon: Cake },
    { id: 'music' as CustomizerTab, label: 'الموسيقى والأغنية', icon: Music },
    { id: 'footer' as CustomizerTab, label: 'الفوتر والختام', icon: MessageCircle },
    { id: 'backup' as CustomizerTab, label: 'النسخ الاحتياطي والأمان', icon: Shield },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#140822] border border-rose-700/50 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full text-right shadow-2xl flex flex-col box-glow h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-rose-900/40 bg-[#140822] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-1.5">
                <span>لوحة تحكم فارس</span>
                <span className="text-amber-300 text-xs sm:text-sm">👑</span>
              </h3>
              <span className="text-[10px] sm:text-[11px] text-rose-300/70 block">
                تعديل أي كلمة، عنوان، تاريخ، صورة أو أغنية في الموقع
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق نافذة التعديل"
            className="text-rose-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Navigation Tabs (smooth touch scrolling on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-rose-900/30 scrollbar-none shrink-0 bg-neutral-950/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/80 border border-rose-400/40 scale-[1.02]'
                    : 'bg-neutral-900/70 text-rose-300/80 hover:text-white hover:bg-neutral-800 border border-rose-900/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {/* TAB 1: BASIC NAMES & DATES */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1.5">
                    <User className="w-3.5 h-3.5 text-rose-400" />
                    <span>اسم حبيبتك (صاحبة العيد)</span>
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="مثلاً: أيويه / حبيبة قلبي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1.5">
                    <User className="w-3.5 h-3.5 text-rose-400" />
                    <span>اسمك أنت (فارس)</span>
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="مثلاً: فارس / حبيبك للأبد"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>تاريخ ميلادها (20 أكتوبر 2007)</span>
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>تاريخ أول يوم اتعرفتوا فيه (21 يوليو)</span>
                  </label>
                  <input
                    type="date"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO TEXTS & COUNTERS */}
          {activeTab === 'hero' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  العنوان الرئيسي الكبير في بداية الموقع:
                </label>
                <input
                  type="text"
                  value={mainHeadline}
                  onChange={(e) => setMainHeadline(e.target.value)}
                  placeholder="كل سنة وأنتي أجمل حاجة في حياتي"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  العبارة الشعرية تحت العنوان الرئيسي:
                </label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="النهاردة مش يوم عادي أبداً.. النهاردة بنحتفل بأجمل ضحكة وأطيب قلب في الدنيا..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  الوسم الرومانسي أعلى العنوان (Kicker Tag):
                </label>
                <input
                  type="text"
                  value={kickerText}
                  onChange={(e) => setKickerText(e.target.value)}
                  placeholder="حكايتنا الحلوة"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Counter 1 Customization */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-3">
                <span className="block text-xs font-bold text-rose-300">
                  ❤️ بطاقة "بقالنا كام يوم نعرف بعض":
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-rose-300/80 mb-1">عنوان البطاقة:</label>
                    <input
                      type="text"
                      value={timeTogetherTitle}
                      onChange={(e) => setTimeTogetherTitle(e.target.value)}
                      placeholder="بقالنا كام يوم نعرف بعض"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-rose-300/80 mb-1">العبارة أسفل العنوان:</label>
                    <input
                      type="text"
                      value={timeTogetherSubtitle}
                      onChange={(e) => setTimeTogetherSubtitle(e.target.value)}
                      placeholder="من يوم ما نورتي حياتي ودنيتي ❤️"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-rose-300/80 mb-1">وصف الأيام:</label>
                  <input
                    type="text"
                    value={timeTogetherLabel}
                    onChange={(e) => setTimeTogetherLabel(e.target.value)}
                    placeholder="يوم حب وعشق وسعادة 💕"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-rose-300/80 mb-1">الجملة الشعرية في أسفل البطاقة:</label>
                  <input
                    type="text"
                    value={timeTogetherPoem}
                    onChange={(e) => setTimeTogetherPoem(e.target.value)}
                    placeholder="وكل ثانية بتعدي مكانتك بتكبر في قلبي أكتر من الأول ❤️"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500 font-poetry"
                  />
                </div>
              </div>

              {/* Counter 2 Customization */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                <span className="block text-xs font-bold text-amber-300">
                  🎂 بطاقة "العد التنازلي لعيد ميلادك":
                </span>
                <div>
                  <label className="block text-[11px] text-amber-200/80 mb-1">عنوان البطاقة:</label>
                  <input
                    type="text"
                    value={countdownTitle}
                    onChange={(e) => setCountdownTitle(e.target.value)}
                    placeholder="العد التنازلي لعيد ميلادك"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-amber-900/40 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-amber-200/80 mb-1">الجملة الشعرية في أسفل البطاقة:</label>
                  <input
                    type="text"
                    value={countdownPoem}
                    onChange={(e) => setCountdownPoem(e.target.value)}
                    placeholder="بنعد اللحظات بالثانية عشان نحتفل بأجمل يوم في السنة كلها ✨"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-amber-900/40 text-sm text-white focus:outline-none focus:border-amber-500 font-poetry"
                  />
                </div>
              </div>

              {/* Wide Button Customization */}
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-700/50 space-y-2">
                <label className="block text-xs font-bold text-rose-200">
                  💌 نص الزر العريض تحت العدادات:
                </label>
                <input
                  type="text"
                  value={openLetterButtonText}
                  onChange={(e) => setOpenLetterButtonText(e.target.value)}
                  placeholder="افتحي الجواب بتاعي ليكي 💌"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LOVE LETTERS */}
          {activeTab === 'letters' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <label className="block text-xs font-semibold text-rose-300">
                  💌 رسالة الظرف السري (زر "افتحي الجواب بتاعي ليكي"):
                </label>
                <span className="block text-[11px] text-rose-400/70">
                  الرسالة اللي بتظهر جوه المودال لما تدوس على الزر العريض
                </span>
                <textarea
                  rows={4}
                  value={envelopeLetterBody}
                  onChange={(e) => setEnvelopeLetterBody(e.target.value)}
                  placeholder="اكتب هنا الرسالة اللي جوه الظرف السري..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <label className="block text-xs font-semibold text-rose-300">
                  📜 عنوان جواب الحب في الصفحة:
                </label>
                <input
                  type="text"
                  value={loveMessageTitle}
                  onChange={(e) => setLoveMessageTitle(e.target.value)}
                  placeholder="جواب حب لست البنات"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />

                <label className="block text-xs font-semibold text-rose-300 pt-1">
                  📜 نص جواب الحب المعروض في أسفل الصفحة:
                </label>
                <textarea
                  rows={5}
                  value={loveMessageBody}
                  onChange={(e) => setLoveMessageBody(e.target.value)}
                  placeholder="اكتب هنا الجواب المعروض في أسفل الصفحة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  💖 بيت الشعر البارز في منتصف الجواب:
                </label>
                <textarea
                  rows={2}
                  value={loveVerseText}
                  onChange={(e) => setLoveVerseText(e.target.value)}
                  placeholder="يا بخت عيني اللي شافت ضحكتك..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-poetry"
                />
              </div>
            </div>
          )}

          {/* TAB 4: REASONS WHY I LOVE YOU */}
          {activeTab === 'reasons' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-rose-300 font-medium mb-1">عنوان قسم الأسباب:</label>
                  <input
                    type="text"
                    value={reasonsTitle}
                    onChange={(e) => setReasonsTitle(e.target.value)}
                    placeholder="ليه بحبك وبموت فيكي؟"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-rose-300 font-medium mb-1">العنوان الفرعي للقسم:</label>
                  <input
                    type="text"
                    value={reasonsSubtitle}
                    onChange={(e) => setReasonsSubtitle(e.target.value)}
                    placeholder="أسرار بيني وبينك · من بين ألف سبب وسبب"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-rose-900/30">
                <span className="text-xs text-rose-300 font-semibold">
                  كروت أسباب الحب ({reasonsWhy.length} أسباب)
                </span>
                <button
                  type="button"
                  onClick={handleAddReason}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة سبب جديد</span>
                </button>
              </div>

              <div className="space-y-3">
                {reasonsWhy.map((reason, idx) => (
                  <div
                    key={reason.id}
                    className="p-3.5 rounded-2xl bg-neutral-950/70 border border-rose-900/40 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={reason.title}
                          onChange={(e) => handleUpdateReason(idx, { title: e.target.value })}
                          placeholder="عنوان السبب"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-rose-900/40 text-sm text-white font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <select
                          value={reason.icon}
                          onChange={(e) => handleUpdateReason(idx, { icon: e.target.value })}
                          className="px-2 py-1.5 rounded-lg bg-neutral-900 border border-rose-900/40 text-xs text-rose-200 focus:outline-none"
                        >
                          <option value="heart">قلب ❤️</option>
                          <option value="smile">ابتسامة 😊</option>
                          <option value="eye">عينين 👀</option>
                          <option value="sun">شمس ☀️</option>
                          <option value="shield">أمان 🛡️</option>
                          <option value="gift">هدية 🎁</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteReason(reason.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-red-300 hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="حذف هذا السبب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={reason.description}
                      onChange={(e) => handleUpdateReason(idx, { description: e.target.value })}
                      placeholder="وصف وتفاصيل السبب..."
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-rose-900/30 text-sm text-rose-100 font-poetry focus:outline-none focus:border-rose-500 leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY SECTION */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  عنوان قسم معرض الصور والذكريات:
                </label>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="معرض صورنا وذكرياتنا الحلوة"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  العنوان الفرعي لمعرض الصور:
                </label>
                <input
                  type="text"
                  value={gallerySubtitle}
                  onChange={(e) => setGallerySubtitle(e.target.value)}
                  placeholder="ألبوم حكاياتنا وسنين حبنا · أول ما اتعرفنا على بعض 21 يوليو 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-700/40 text-xs text-rose-200/90 leading-relaxed">
                <span className="font-bold text-white block mb-1">📸 إضافة الصور ومسحها:</span>
                تقدر ترفع صوركم مباشرة من قسم المعرض في الصفحة من خلال زر "ارفع صورة جديدة لينا"، أو تختار صور متعددة من موبايلك، وتعدل أو تمسح أي صورة في أي وقت!
              </div>
            </div>
          )}

          {/* TAB 6: CAKE & CANDLE */}
          {activeTab === 'cake' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1.5">
                    عنوان قسم الشمعة والتورتة:
                  </label>
                  <input
                    type="text"
                    value={wishSectionTitle}
                    onChange={(e) => setWishSectionTitle(e.target.value)}
                    placeholder="طفي الشمعة واتمني أمنية من قلبك"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1.5">
                    العنوان الفرعي للقسم:
                  </label>
                  <input
                    type="text"
                    value={wishSectionSubtitle}
                    onChange={(e) => setWishSectionSubtitle(e.target.value)}
                    placeholder="احتفالنا بسنتك الجديدة · أمنيات من كل القلب"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1.5">
                  <Cake className="w-3.5 h-3.5 text-amber-400" />
                  <span>العبارة المكتوبة على تورتة عيد الميلاد:</span>
                </label>
                <input
                  type="text"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder={`كل سنة وأنتي طيبة يا ${partnerName || 'حبيبتي'}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>الدعاء والأمنية السرية (اللي بتظهر لما تطفي الشمعة):</span>
                </label>
                <textarea
                  rows={4}
                  value={wishMessageBody}
                  onChange={(e) => setWishMessageBody(e.target.value)}
                  placeholder="يا رب يجعل أيامك الجاية كلها سكر زي قلبك..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 7: MUSIC & AUDIO */}
          {activeTab === 'music' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950/80 border border-rose-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                    <Music className="w-4 h-4 text-rose-400" />
                    <span>ملف الأغنية (من الموبايل أو الكمبيوتر مباشرة) 🎵</span>
                  </label>
                  <span className="text-[10px] text-pink-300/80">MP3 / M4A / تسجيل</span>
                </div>

                {!hasActiveAudioFile ? (
                  <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-rose-600/50 hover:border-rose-400 rounded-xl cursor-pointer bg-rose-950/20 hover:bg-rose-950/40 transition-all text-center group">
                    <UploadCloud className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform animate-pulse" />
                    <div>
                      <span className="block text-xs sm:text-sm font-bold text-white">
                        اضغط هنا واختار ملف الأغنية من جهازك 🎵
                      </span>
                      <span className="block text-[11px] text-rose-300/70 mt-1">
                        هيتحفظ على جهازك وهيشتغل على طول بدون روابط خارجية
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
                      onChange={handleAudioFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/50 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="text-right overflow-hidden">
                          <span className="text-xs font-bold text-white block truncate">
                            {selectedAudioFile ? selectedAudioFile.name : currentUploadedName}
                          </span>
                          <span className="text-[10px] text-rose-300/80">
                            {selectedAudioFile
                              ? `${(selectedAudioFile.size / (1024 * 1024)).toFixed(2)} ميجابايت (جاهزة للحفظ)`
                              : 'أغنيتكم الخاصة مرفوعة ومحفوظة على جهازك ✅'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveAudio}
                        title="حذف الأغنية والرجوع لعزف البيانو"
                        className="p-1.5 px-2.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">حذف</span>
                      </button>
                    </div>

                    {activeAudioPreview && (
                      <div className="mt-1">
                        <span className="text-[10px] text-rose-300/70 block mb-1">
                          تجربة الاستماع للأغنية المختارة:
                        </span>
                        <audio src={activeAudioPreview} controls className="w-full h-8 rounded-lg" />
                      </div>
                    )}

                    <label className="text-[11px] text-rose-400 hover:text-rose-200 underline cursor-pointer text-center block pt-1">
                      تغيير واختيار ملف أغنية تاني
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
                        onChange={handleAudioFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                    اسم الأغنية اللي هيظهر في المشغل:
                  </label>
                  <input
                    type="text"
                    value={customSongTitle}
                    onChange={(e) => setCustomSongTitle(e.target.value)}
                    placeholder="أغنيتنا الحلوة اللي بنحبها 🎵"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="pt-1 border-t border-rose-900/30">
                  <label className="block text-[11px] text-rose-300/70 mb-1">
                    أو رابط MP3 مباشر (اختياري):
                  </label>
                  <input
                    type="text"
                    value={customSongUrl}
                    onChange={(e) => setCustomSongUrl(e.target.value)}
                    placeholder="https://example.com/our-song.mp3"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-rose-900/30 text-xs text-white/80 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FOOTER */}
          {activeTab === 'footer' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  عبارة الحب الرئيسية في الفوتر:
                </label>
                <input
                  type="text"
                  value={footerLoveText}
                  onChange={(e) => setFooterLoveText(e.target.value)}
                  placeholder="اتعملت بكل حب عشان عيون"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  النص الشعري التكميلي في الفوتر:
                </label>
                <textarea
                  rows={3}
                  value={footerSubtext}
                  onChange={(e) => setFooterSubtext(e.target.value)}
                  placeholder="كل ثانية، وكل دقيقة، وكل سنة.. وأنتي أجمل نعمة في حياتي ومنورة دنيتي كلها."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-base text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 9: BACKUP & DATA SECURITY */}
          {activeTab === 'backup' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-right">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>الحفظ الدائم نشط ومحمي 🔒</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  كل تعديل تقوم به يتم حفظه فوراً في السيرفر وعلى متصفحك. لن تضيع بياناتك ولن تُمسح عند إعادة تحميل الموقع أو عند فتح الرابط من هاتف آخر.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-rose-900/40 space-y-3">
                <h4 className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>تحميل نسخة احتياطية من كل التعديلات</span>
                </h4>
                <p className="text-[11px] text-rose-300/70">
                  يمكنك تنزيل ملف JSON يحتوي على كامل نصوصك وصورك وتواريخك للاحتفاظ بنسخة إضافية معك دائماً.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/30 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-rose-300" />
                  <span>تنزيل ملف النسخة الاحتياطية (JSON) 📥</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-rose-900/40 space-y-3">
                <h4 className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>استعادة من ملف نسخة احتياطية</span>
                </h4>
                <p className="text-[11px] text-rose-300/70">
                  إذا كنت تملك ملف نسخة سابقة، يمكنك استعادته بلمسة واحدة ليتم تطبيق كل محتوياته فوراً.
                </p>
                <label className="w-full py-2.5 px-4 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                  <Upload className="w-4 h-4 text-purple-300" />
                  <span>اختيار ملف النسخة الاحتياطية واستعادتها 📂</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackupFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Sticky Bottom Actions Bar (accessible with thumb on phones) */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#10061b] border-t border-rose-900/40 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-200 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">رجّع كل البيانات الأصلية</span>
            <span className="sm:hidden">إعادة ضبط</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-rose-300 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl shadow-lg shadow-rose-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'احفظ التعديلات في الموقع ✨'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
