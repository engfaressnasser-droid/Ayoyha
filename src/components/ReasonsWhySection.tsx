import React, { useState } from 'react';
import { Sparkles, Heart, Smile, Sun, Shield, Eye, Gift, Edit3, Plus } from 'lucide-react';
import { LoveReason } from '../types';

interface ReasonsWhySectionProps {
  reasons?: LoveReason[];
  canEdit?: boolean;
  reasonsTitle?: string;
  reasonsSubtitle?: string;
  onEditSection?: (tab: 'basic' | 'hero' | 'letters' | 'reasons' | 'gallery' | 'cake' | 'music' | 'footer') => void;
}

const DEFAULT_REASONS: LoveReason[] = [
  {
    id: 1,
    icon: 'smile',
    title: 'ضحكتك اللي بتنورلي الدنيا',
    description: 'لما بتضحكي من قلبك، بحس إن كل تعب الدنيا اتبخر في ثانية، وكأن الفرحة اتخلقت مخصوص عشان وشك.',
  },
  {
    id: 2,
    icon: 'heart',
    title: 'قلبك الأبيض وحنيتك اللي ملهاش زي',
    description: 'طيبتك الفطرية وخوفك عليا واهتمامك بأصغر تفاصيلي بتخليني طاير بيكي ومفيش أسعد مني في الكون.',
  },
  {
    id: 3,
    icon: 'eye',
    title: 'نظرة عينيكي اللي بدوب فيها',
    description: 'في عينيكي بشوف أماني وبيتي ومستقبلي كله، وبحس إن ده المكان الوحيد اللي بهدى فيه بجد.',
  },
  {
    id: 4,
    icon: 'sun',
    title: 'شقاوتك وروحك الحلوة العفوية',
    description: 'عفويتك وجنانك اللذيذ وضحكتك اللي بتطلع من القلب بتخلي لأي يوم عادي جنبك طعم وفرحة تانية خالص.',
  },
  {
    id: 5,
    icon: 'shield',
    title: 'إنك سندي ومطرح ما برتاح',
    description: 'لما الدنيا بتضيق بيا، مش برتاح غير لما أسمع صوتك وأفضفضلك.. أنتي أماني ومطرح ما بهرب من الدنيا.',
  },
  {
    id: 6,
    icon: 'gift',
    title: 'عشان أنتي أحلى رزق ونعمة',
    description: 'بكل تفاصيلك، بصوتك، بطريقتك.. أنتي أحلى حاجة دخلت حياتي ومستعد أعيش عمري كله بس عشان أسعدك.',
  },
];

export const ReasonsWhySection: React.FC<ReasonsWhySectionProps> = ({
  reasons,
  canEdit,
  reasonsTitle = 'ليه بحبك وبموت فيكي؟',
  reasonsSubtitle = 'أسرار بيني وبينك · من بين ألف سبب وسبب',
  onEditSection,
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const activeReasons = reasons && reasons.length > 0 ? reasons : DEFAULT_REASONS;

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'smile':
        return <Smile className="w-5 h-5 text-pink-400" />;
      case 'heart':
        return <Heart className="w-5 h-5 text-rose-400 fill-rose-500/30" />;
      case 'eye':
        return <Eye className="w-5 h-5 text-amber-300" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-purple-400" />;
      default:
        return <Gift className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <section id="reasons" className="relative py-14 sm:py-24 px-3 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 sm:mb-16">
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-2">
          <span>{reasonsSubtitle}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {reasonsTitle}
          </h2>
          {canEdit && onEditSection && (
            <button
              onClick={() => onEditSection('reasons')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 hover:bg-rose-900 text-amber-200 text-xs font-semibold transition-all cursor-pointer border border-rose-700/50 shadow"
              title="تعديل أو إضافة أسباب الحب"
            >
              <Edit3 className="w-3 h-3 text-amber-300" />
              <span>تعديل الأسباب</span>
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-rose-300/70 mt-2 max-w-lg mx-auto">
          دوسي على أي كارت وشوفي سر من أسراري ليكي
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {activeReasons.map((item, index) => {
          return (
            <div
              key={item.id || index}
              onClick={() => toggleFlip(item.id || index)}
              className="relative min-h-[170px] sm:min-h-[190px] rounded-2xl p-4 sm:p-6 border border-rose-900/30 bg-[#13091c]/80 hover:border-rose-500/40 hover:bg-[#180c24] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-rose-950/40 flex flex-col justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-rose-400/80 bg-rose-950/40 px-2 py-0.5 rounded-md">
                  #{index + 1}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed font-poetry">
                  {item.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-rose-900/30 flex items-center justify-between text-[10px] sm:text-[11px] text-rose-400/60 group-hover:text-rose-300 transition-colors">
                <span>سر من أسرار حبي ليكي</span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
