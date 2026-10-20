export interface MemoryImage {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageUrl: string;
  fallbackGradient: string;
}

export interface LoveReason {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface BirthdayConfig {
  // Basic Names & Dates
  partnerName: string;
  senderName: string;
  birthDate: string; // YYYY-MM-DD
  anniversaryDate: string; // YYYY-MM-DD

  // Hero Section
  mainHeadline: string;
  subtitle?: string;
  kickerText?: string;
  openLetterButtonText?: string;

  // Counter 1: Time Together
  timeTogetherTitle?: string;
  timeTogetherSubtitle?: string;
  timeTogetherLabel?: string;
  timeTogetherPoem?: string;

  // Counter 2: Birthday Countdown
  countdownTitle?: string;
  countdownPoem?: string;

  // Love Letters
  loveMessageTitle: string;
  loveMessageBody: string;
  loveVerseText?: string;
  envelopeLetterBody?: string;

  // Reasons Why Section
  reasonsTitle?: string;
  reasonsSubtitle?: string;
  reasonsWhy?: LoveReason[];

  // Gallery Section
  galleryTitle?: string;
  gallerySubtitle?: string;

  // Birthday Wish / Cake Section
  wishSectionTitle?: string;
  wishSectionSubtitle?: string;
  wishMessageTitle?: string;
  wishMessageBody?: string;
  cakeMessage?: string;

  // Music & Audio
  customSongUrl?: string;
  customSongTitle: string;

  // Footer
  footerLoveText?: string;
  footerSubtext?: string;
}
