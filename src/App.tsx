/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { FloatingHeartsCanvas } from './components/FloatingHeartsCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LoveLetterSection } from './components/LoveLetterSection';
import { GallerySection } from './components/GallerySection';
import { ReasonsWhySection } from './components/ReasonsWhySection';
import { BirthdayWishSection } from './components/BirthdayWishSection';
import { CustomizerModal, CustomizerTab } from './components/CustomizerModal';
import { LoveLetterModal } from './components/LoveLetterModal';
import { LoginGateway, UserSession } from './components/LoginGateway';
import { Footer } from './components/Footer';
import { BirthdayConfig, MemoryImage, LoveReason } from './types';
import { getCustomAudio, removeCustomAudio } from './utils/audioStorage';
import { saveMemoriesToIndexedDB, getMemoriesFromIndexedDB } from './utils/photoStorage';

const DEFAULT_ENVELOPE_LETTER = `كل سنة وانتي طيبة يا أيويه يا روح قلبي، وكل سنة وانتي معايا ومنورة حياتي، وكل سنة وانتي أحلى حاجة حصلتلي في الدنيا ❤️

النهارده مش يوم عادي بالنسبالي خالص، ده عيد ميلاد أغلى واحدة عندي، البنت اللي وجودها في حياتي فرق معايا في حاجات كتير أوي، واللي بقى مجرد كلامي معاها كفاية يخليني مبسوط، واللي بقيت بستنى رسالتها وأفرح من قلبي لما أسمع صوتها أو أشوف ضحكتها ❤️

يا أيويه، أنا عارف إني مش دايمًا بعرف أقولك كل اللي جوايا، ومهما اتكلمت مش هعرف أوصفلك انتي غالية عندي قد إيه، بس والله انتي بقيتي جزء كبير من حياتي، وبقيت أهتم بكل تفاصيلك، بفرح لفرحتك وبزعل لزعلك، وببقى نفسي أشوفك مبسوطة دايمًا ومفيش حاجة تضايقك أبدًا. انتي مش مجرد البنت اللي بحبها، انتي البنت اللي بجد فارقة معايا ونفسي أشوفها أسعد واحدة في الدنيا ❤️

وفي عيد ميلادك، كل اللي بتمناه من ربنا إنه يفرح قلبك ويحققلك كل اللي نفسك فيه، ويبعد عنك أي زعل أو وجع، وأفضل أشوف ضحكتك الحلوة دي دايمًا. ونفسي أكون الشخص اللي تلاقيه جنبك وقت ما تحتاجيه، اللي تحكيله كل اللي جواكي من غير ما تخافي، واللي تحسي معاه إنك مش لوحدك مهما حصل، وأكون دايمًا سبب في فرحتك مش زعلك يا حبيبتي ❤️

ونفسي يا أيويه نفضل مع بعض ونعيش أيام كتير حلوة، ونفضل نعمل ذكريات نفتكرها ونضحك عليها بعدين، وأفضل أحتفل بعيد ميلادك كل سنة وانتي معايا، وأشوفك بتكبري وبتحققي كل اللي بتحلمي بيه وأنا فرحان بيكي وفخور بيكي. ويا رب مهما عدّى علينا وقت، نفضل قريبين من بعض ونفضل نختار بعض كل يوم، ونعدي أي حاجة صعبة وإيدينا في إيد بعض ❤️♾️💍

بحبك يا أيويه، وبحب كل حاجة فيكي، ضحكتك وكلامك ودلعك وحتى رغاويكي 😂❤️ وبحب إني بقيت أشاركك يومي وأحكيلك عن الحاجات اللي بتحصل معايا، وبحب إحساسي وأنا معاكي، وبحب إنك بقيتي من أهم الناس في حياتي. ونفسي أفضل دايمًا الشخص اللي تفرحي بوجوده، واللي قلبك يطمنله، واللي تحسي معاه قد إيه انتي غالية ومحبوبة يا روح قلبي 

كل سنة وانتي طيبة يا أيويه، وكل سنة وانتي حبيبتي وأجمل بنوتة في عيني، وكل سنة وانتي معايا ومبسوطة وبتحققي كل اللي نفسك فيه. ويا رب السنة دي تكون أحلى سنة عليكي، وأفضل جنبك في كل السنين اللي جاية، ونفضل نحب بعض ونفرح بعض ونكبر سوا. بحبك أوي يا قلب حبيبك، وربنا يخليكي ليا وما يحرمنيش منك أبدًا، وعقبال مليون سنة وانتي معايا يا أجمل حاجة في حياتي كلها ❤️🎂💋♾️`;

const DEFAULT_PAGE_LOVE_MESSAGE = `كل سنة وانتي طيبة يا أيويه قلبي وروحي، وكل سنة وانتي أجمل حاجة حصلتلي في حياتي، وكل سنة وانتي معايا ومنورة دنيتي بضحكتك ووجودك يا حبيبتي ❤️

النهارده مش يوم عادي بالنسبالي، النهارده عيد ميلاد أغلى وأحن وأجمل بنت في عيني، البنت اللي وجودها في حياتي بقى حاجة مفيش كلام يوصفها، واللي كل يوم بتخليني أحس إن لسه في حاجات حلوة كتير في الدنيا تستاهل إننا نعيشها ونفرح بيها ❤️

يا أيويه، أنا يمكن مش بعرف أعبّرلك كل يوم عن اللي جوايا، ويمكن ساعات كلامي ميقدرش يوصف إحساسي ناحيتك، بس والله انتي ليكي مكانة في قلبي محدش يقدر ياخدها، وليكي معزة عندي أكبر بكتير من أي كلام ممكن أقوله. انتي مش مجرد بنت بحبها، انتي بقيتي حد فارق معايا بجد، حد بزعل لزعله وبفرح لفرحه، وحد نفسي أشوفه مبسوط ومرتاح طول العمر ❤️

في يوم ميلادك، بدعي ربنا من كل قلبي إنه يفرح قلبك على قد جمال قلبك، ويحققلك كل حاجة نفسك فيها، ويبعد عنك أي وجع أو زعل، ويخلي ضحكتك الحلوة دي متفارقش وشك أبدًا. ونفسي أكون دايمًا سبب في فرحتك، وأكون الشخص اللي لما الدنيا تضايقك تلاقيه جنبك، ولما تتعبي تلاقيه سند ليكي، ولما تحسي إن الدنيا تقيلة عليكي تلاقي حضنه أمان ليكي ❤️♾️

كل سنة وانتي حبيبتي وأجمل بنوتة في الدنيا كلها، وكل سنة وانتي أقرب واحدة لقلبي، وكل سنة وإحنا مع بعض بنصنع ذكريات حلوة ونضحك ونفرح ونعدي أي حاجة صعبة وإيدينا في إيد بعض. نفسي أعيش معاكي أعياد ميلاد كتير أوي، وكل سنة أكون أول واحد يقولك كل سنة وانتي طيبة، وأفضل أشوف الفرحة في عينيكي وأنا جنبك يا روح قلبي ❤️🎂💍

بحبك يا أيويه، بحب وجودك وتفاصيلك وضحكتك وكل حاجة فيكي، وبحب إحساسي وأنا بكلمك، وبحب إنك بقيتي جزء من يومي ومن تفكيري ومن الحاجات اللي بتخليني أبتسم من غير سبب. ويا رب أفضل دايمًا الشخص اللي قلبك يطمنله، واللي تحسي معاه إنك محبوبة ومقدرة وغالية أوي ❤️

**كل سنة وانتي عيدي الحلو يا أيويه، وكل سنة وانتي حبيبتي ونصيبي الحلو، وكل سنة وانتي معايا يا أجمل حاجة في عمري. بحبك أكتر من كل الكلام اللي اتقال واللي لسه هيتقال، وعيد ميلاد سعيد يا قلب حبيبك، ويا رب أشوفك أسعد واحدة في الدنيا كلها. ❤️🎂💋♾️`;

const DEFAULT_SUBTITLE =
  'النهاردة مش يوم عادي أبداً.. النهاردة بنحتفل بأجمل ضحكة وأطيب قلب في الدنيا، اليوم اللي اتولدت فيه أميرتي';

const DEFAULT_LOVE_VERSE = 'يا أيويه يا نبض قلبي ونور عنيا، لو خيروني بين الدنيا، هختارِك إنتي ليا ❤️♾️';

const DEFAULT_WISH_BODY =
  'يا رب يجعل أيامك الجاية كلها سكر زي قلبك، ويفرح روحك وما يوريني فيكي أي حاجة وحشة أبداً، وتفضلي منورة حياتي ومحليّاها دايماً يا أجمل حظ في عمري.';

const DEFAULT_REASONS: LoveReason[] = [
  {
    id: 1,
    icon: 'smile',
    title: 'ضحكتك اللي بتنورلي الدنيا',
    description:
      'ضحكتك يا أيويه كفاية تمحي أي هم أو تعب جوايا في ثانية، وترجع تنوّر روحي من تاني، كأن الدنيا كلها بترجع حلوة أول ما أشوفك بتضحكي ❤️',
  },
  {
    id: 2,
    icon: 'heart',
    title: 'قلبك الأبيض وحنيتك اللي ملهاش زي',
    description: 'قلبك الأبيض النقي اللي مليان حنية وطيبة مفيش زيه في الدنيا كلها.',
  },
  {
    id: 3,
    icon: 'eye',
    title: 'نظرة عينيكي اللي بدوب فيها',
    description:
      'لما بتبصيلي يا أيويه بحس إن الدنيا كلها بقت ملكي، وإن مفيش حاجة ناقصاني طول ما انتي في حياتي، ولما ببص في عينيكي بشوف كل أحلامي اللي نفسي أحققها، ومستقبلي اللي بتمنى أعيشه معاكي ❤️',
  },
  {
    id: 4,
    icon: 'sun',
    title: 'شقاوتك وروحك الحلوة العفوية',
    description:
      'شخصيتك المميزة وهدوءك ليهم سحر خاص يا أيويه، وحضورك لوحده كفاية يخليكي تلفتي النظر من غير ما تعملي أي حاجة، وتفضلي دايمًا ملكة في عيون الكل، وملكت قلبي أنا قبل أي حد ❤️👑💗',
  },
  {
    id: 5,
    icon: 'shield',
    title: 'إنك سندي ومطرح ما برتاح',
    description:
      'لما الدنيا بتضيق بيا، مش برتاح غير لما أسمع صوتك وأفضفضلك.. أنتي أماني ومطرح ما بهرب من الدنيا.',
  },
  {
    id: 6,
    icon: 'gift',
    title: 'عشان أنتي أحلى رزق ونعمة',
    description:
      'بكل تفاصيلك، بصوتك، بطريقتك.. أنتي أحلى حاجة دخلت حياتي ومستعد أعيش عمري كله بس عشان أسعدك.بحبك يا أيويه بكل حاجة فيكي، بكل تفاصيلك الصغيرة قبل الكبيرة، بحلوِك وزعلك ودلعك وكل حاجة بتميزك، بحبك حب ملوش شروط ولا حدود، حب نفسي يفضل معايا طول العمر، وكل يوم يكبر أكتر من اليوم اللي قبله، لأنك بالنسبالي مش مجرد حب، انتي حكاية قلبي اللي نفسي تفضل مكملة لآخر العمر يا روح قلبي ❤️♾️💗',
  },
  {
    id: 7,
    icon: 'shield',
    title: 'خوفك عليا',
    description:
      'خوفك عليا وسؤالك عن كل تفاصيل يومي، حتى أبسط الحاجات، بيحسسني إني غالي عندك أوي، وإن في قلبك حد بيهتم بيا وبتفاصيل حياتي بجد، وده من أكتر الحاجات اللي بتخليني أحس بحبك يا أيويه ❤️',
  },
];

const INITIAL_CONFIG: BirthdayConfig = {
  partnerName: 'ايويه',
  senderName: 'فارس',
  birthDate: '2007-10-20',
  anniversaryDate: '2026-05-21',

  mainHeadline: 'كل سنة وأنتي أجمل حاجة في حياتي',
  subtitle: DEFAULT_SUBTITLE,
  kickerText: 'حكايتنا الحلوة',
  openLetterButtonText: 'افتحي الجواب بتاعي ليكي 💌',

  timeTogetherTitle: 'بقالنا كام يوم نعرف بعض',
  timeTogetherSubtitle: 'من يوم ما نورتي حياتي ودنيتي ❤️',
  timeTogetherLabel: 'يوم حب 💕',
  timeTogetherPoem: 'وكل ثانية بتعدي مكانتك بتكبر في قلبي أكتر من الأول ❤️',

  countdownTitle: 'العد التنازلي لعيد ميلادك',
  countdownPoem: 'بنعد اللحظات بالثانية عشان نحتفل بأجمل يوم في السنة كلها ✨',

  loveMessageTitle: 'جواب حب لست البنات',
  loveMessageBody: DEFAULT_PAGE_LOVE_MESSAGE,
  loveVerseText: DEFAULT_LOVE_VERSE,
  envelopeLetterBody: DEFAULT_ENVELOPE_LETTER,

  reasonsTitle: 'ليه بحبك وبموت فيكي؟',
  reasonsSubtitle: 'أسرار بيني وبينك · من بين ألف سبب وسبب',
  reasonsWhy: DEFAULT_REASONS,

  galleryTitle: 'معرض صورنا وذكرياتنا الحلوة',
  gallerySubtitle: 'ألبوم حكاياتنا وسنين حبنا · أول ما اتعرفنا على بعض 21 يوليو 2026',

  wishSectionTitle: 'طفي الشمعة واتمني أمنية من قلبك',
  wishSectionSubtitle: 'احتفالنا بسنتك الجديدة · أمنيات من كل القلب',
  wishMessageBody: DEFAULT_WISH_BODY,
  cakeMessage: '',

  customSongTitle: 'عامر منيب - حب العمر 🎵',
  customSongUrl: '/music/hobb-al-omr.mp3',

  footerLoveText: 'اتعملت بكل حب عشان عيون',
  footerSubtext: 'كل ثانية، وكل دقيقة، وكل سنة.. وأنتي أجمل نعمة في حياتي ومنورة دنيتي كلها.',
};

// Permanent gallery memories baked directly into code so they can never be lost
const INITIAL_MEMORIES: MemoryImage[] = [
  {
    id: 'photo_1792489956404',
    title: 'حلويااااات',
    date: 'لحظة خاصة',
    caption:
      'يا أيويه، انتي حلوة أوي في الصورة دي بجد 😍❤️ عينيكي لوحدهم حكاية، والآيلاينر مبرز جمالهم بطريقة تخلي الواحد يسرح فيهم ومياخدش باله من أي حاجة تانية والطرحة الرمادي مع النبيتي لايقين عليكي أوي، ومديين ملامحك جمال وهدوء كده يخطفوا القلب. حتى طريقتك وانتي حاطة إيدك على دقنك فيها رقة ودلع مش طبيعي، وكل تفصيلة في الصورة مخلية جمالك باين أكتر. بجد يا أيويه انتي قمر، وكل ما أبص للصورة دي بحس إن جمالك ليه حاجة مميزة كده صعب تتوصف بالكلام ❤️‍🔥',
    imageUrl: '/uploads/photo_1792489959014_33id2i.jpg',
    fallbackGradient: 'from-rose-950 via-purple-950 to-neutral-950',
  },
  {
    id: 'photo_1792489854785',
    title: 'عيون تسحر عقلي',
    date: 'لحظة خاصة',
    caption:
      'يا أيويه يا بنتي، إيه حلاوة عينيكي دي بس؟ ❤️ بجد عينيكي في الصورة دي شدّوني أوي، ورموشك مديّاهم جمال كده يخلي الواحد يسرح فيهم من غير ما يحس وملامحك مع الطرحة لايقين على بعض بشكل يجنن، بس عينيكي دول حكاية تانية خالص، فيهم حاجة كده تخلي الواحد مش عايز يبص في أي حتة غيرهم 😂❤️‍🔥 مش عارف إيه أكتر حاجة حلوة فيكي، عينيكي ولا ضحكتك ولا ملامحك، بس اللي متأكد منه إنك حلوة أوي يا أيويه، وكل مرة بشوفك فيها بحس إنك أحلى من المرة اللي قبلها 💋❤️',
    imageUrl: '/uploads/photo_1792489857302_yv4n7o.jpg',
    fallbackGradient: 'from-rose-950 via-purple-950 to-neutral-950',
  },
  {
    id: 'photo_1792489780395',
    title: 'صوره عيد ميلادك',
    date: 'لحظة خاصة',
    caption:
      'يا أيويه يا بت يا قمر انتي 😂❤️ إيه الحلاوة دي بس؟ ضحكتك وكسوفتك وملامحك في الصورة دي مخليينك جميلة بشكل مش طبيعي  من كتر ما انتي حلوة الواحد ممكن يفضل يبص للصورة دي ومش يزهق، وكل مرة يلاحظ فيكي حاجة أحلى من اللي قبلها. انتي ليكي جمال كده هادي وبسيط، بس بيدخل القلب من غير استئذان يا أجمل أيويه في الدنيا ❤️‍🔥💋',
    imageUrl: '/uploads/photo_1792489783824_qmu91v.jpg',
    fallbackGradient: 'from-rose-950 via-purple-950 to-neutral-950',
  },
  {
    id: 'photo_1792489710864',
    title: 'اكتر صوره بحبهااا',
    date: 'لحظة خاصة',
    caption:
      'يا أيويه يا روح قلبي ❤️ والله كل ما ببص للصورة دي بحس إني محظوظ أوي إنك في حياتي، هو في جمال كده أصلًا؟ 😂💗 عيني بتفضل تتأمل فيكي وفي تفاصيلك ومش بمل منك أبدًا، وكل مرة بحس إني بشوفك لأول مرة وبحبك من جديد. نفسي أفضل أشوف ضحكتك الحلوة دي، وأعيش معاكي لحظات وذكريات تفضل معانا طول العمر. انتي مش مجرد صورة حلوة بحب أبصلها، انتي البنت اللي وجودها لوحده بيخلّي حياتي أحلى، وأجمل حاجة قلبي اختارها يا حتة من قلبي ❤️♾️',
    imageUrl: '/uploads/photo_1792489713442_jybhx9.jpg',
    fallbackGradient: 'from-rose-950 via-purple-950 to-neutral-950',
  },
];

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const saved = localStorage.getItem('romantic_bday_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          customSongUrl: parsed.customSongUrl || INITIAL_CONFIG.customSongUrl,
          customSongTitle: parsed.customSongTitle || INITIAL_CONFIG.customSongTitle,
        };
      }
      return INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [memories, setMemories] = useState<MemoryImage[]>(() => {
    try {
      const saved = localStorage.getItem('romantic_bday_memories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state with server on mount for permanent persistence across devices
  useEffect(() => {
    let isMounted = true;

    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.config) {
          setConfig((prev) => {
            const merged = { ...INITIAL_CONFIG, ...prev, ...data.config };
            try {
              localStorage.setItem('romantic_bday_config', JSON.stringify(merged));
            } catch (e) {
              console.error(e);
            }
            return merged;
          });
        } else if (data.success && !data.config) {
          // Server has no saved config yet; push current local config to server so it's backed up permanently
          const localSaved = localStorage.getItem('romantic_bday_config');
          if (localSaved) {
            fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: localSaved,
            }).catch(() => {});
          }
        }
      })
      .catch((err) => console.log('Using local config fallback:', err));

    // Load persistent memories from IndexedDB
    getMemoriesFromIndexedDB().then((idbMemories) => {
      if (isMounted && idbMemories && idbMemories.length > 0) {
        setMemories((prev) => {
          const ids = new Set(idbMemories.map((m) => m.id));
          const extra = prev.filter((m) => !ids.has(m.id));
          return [...idbMemories, ...extra];
        });
      }
    });

    fetch('/api/memories')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.memories) && data.memories.length > 0) {
          setMemories((prev) => {
            const serverIds = new Set(data.memories.map((m: MemoryImage) => m.id));
            const localOnly = prev.filter((m) => !serverIds.has(m.id));
            const merged = [...data.memories, ...localOnly];
            saveMemoriesToIndexedDB(merged);
            try {
              localStorage.setItem('romantic_bday_memories', JSON.stringify(merged));
            } catch (e) {
              console.error(e);
            }
            return merged;
          });
        } else if (data.success && (!data.memories || data.memories.length === 0)) {
          const localMem = localStorage.getItem('romantic_bday_memories');
          if (localMem) {
            fetch('/api/memories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: localMem,
            }).catch(() => {});
          }
        }
      })
      .catch((err) => console.log('Using local memories fallback:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // User login session (Faress = admin, ايويه = viewer)
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('romantic_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        const nameLower = (parsed.name || '').toLowerCase();
        const isFaress =
          nameLower.includes('fare') ||
          (parsed.name && parsed.name.includes('فارس'));
        return {
          ...parsed,
          role: isFaress ? 'admin' : 'viewer',
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isPreviewingAsViewer, setIsPreviewingAsViewer] = useState<boolean>(false);

  // Stored audio state from phone via IndexedDB
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string>('');

  // Global Audio Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerTab, setCustomizerTab] = useState<CustomizerTab>('basic');
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

  const handleOpenCustomizer = (tab: CustomizerTab = 'basic') => {
    setIsPreviewingAsViewer(false);
    setCustomizerTab(tab);
    setIsCustomizerOpen(true);
  };

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    setIsPreviewingAsViewer(false);
    handleEnsureAudioStarted();
    try {
      localStorage.setItem('romantic_user_session', JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setIsPreviewingAsViewer(false);
    try {
      localStorage.removeItem('romantic_user_session');
    } catch (e) {
      console.error(e);
    }
  };

  // Load custom audio from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    getCustomAudio().then((stored) => {
      if (isMounted && stored) {
        const url = URL.createObjectURL(stored.blob);
        setUploadedAudioUrl(url);
        setUploadedAudioName(stored.fileName);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAudioUploaded = (blobUrl: string, fileName: string) => {
    if (uploadedAudioUrl) {
      URL.revokeObjectURL(uploadedAudioUrl);
    }
    setUploadedAudioUrl(blobUrl);
    setUploadedAudioName(fileName);
  };

  const handleAudioRemoved = async () => {
    if (uploadedAudioUrl) {
      URL.revokeObjectURL(uploadedAudioUrl);
    }
    setUploadedAudioUrl(null);
    setUploadedAudioName('');
    await removeCustomAudio();
  };

  // Save changes to localStorage AND server permanently
  const handleSaveConfig = async (updated: BirthdayConfig) => {
    setConfig(updated);
    try {
      localStorage.setItem('romantic_bday_config', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم حفظ جميع التعديلات نهائياً على السيرفر ولم تُمسح أبداً! 🔒✨');
      } else {
        showToast('تم حفظ التعديلات في متصفحك بنجاح! ✨');
      }
    } catch {
      showToast('تم حفظ التعديلات في متصفحك بنجاح! ✨');
    }
  };

  const handleResetDefaults = async () => {
    setConfig(INITIAL_CONFIG);
    setMemories(INITIAL_MEMORIES);
    localStorage.removeItem('romantic_bday_config');
    localStorage.removeItem('romantic_bday_memories');
    await handleAudioRemoved();
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setIsCustomizerOpen(false);
    showToast('تمت إعادة ضبط الموقع للوضع الأصلي 🔄');
  };

  const handleAddMemory = async (newMem: MemoryImage) => {
    setMemories((prev) => {
      const updated = [newMem, ...prev];
      saveMemoriesToIndexedDB(updated);
      try {
        localStorage.setItem('romantic_bday_memories', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Sync updated array (with full photo data) directly to server so all devices render it
      fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch((err) => console.error('Failed to sync new memory to server:', err));

      return updated;
    });

    showToast('تمت إضافة الصورة وحفظها بنجاح! 📸✨');
  };

  const handleUpdateMemory = async (updatedMem: MemoryImage) => {
    setMemories((prev) => {
      const updated = prev.map((m) => (m.id === updatedMem.id ? updatedMem : m));
      saveMemoriesToIndexedDB(updated);
      try {
        localStorage.setItem('romantic_bday_memories', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Sync updated array to server so all devices render the modification
      fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch((err) => console.error('Failed to sync updated memory to server:', err));

      return updated;
    });

    showToast('تم تعديل الصورة وحفظها بنجاح! ✏️✨');
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMemoriesToIndexedDB(updated);
      try {
        localStorage.setItem('romantic_bday_memories', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch((err) => console.error('Failed to sync delete to server:', err));
      return updated;
    });
    showToast('تم مسح الصورة من الألبوم 🗑️');
  };

  const handleSaveMemories = async (updatedMemories: MemoryImage[]) => {
    setMemories(updatedMemories);
    saveMemoriesToIndexedDB(updatedMemories);
    try {
      localStorage.setItem('romantic_bday_memories', JSON.stringify(updatedMemories));
    } catch (e) {
      console.error(e);
    }

    fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMemories),
    }).catch((err) => console.error('Failed to sync memories to server:', err));

    showToast('تم حفظ معرض الصور والذكريات بنجاح! 📸✨');
  };

  const activeSongUrl = uploadedAudioUrl || config.customSongUrl || '/music/hobb-al-omr.mp3';
  const activeSongTitle = uploadedAudioName
    ? config.customSongTitle || uploadedAudioName
    : config.customSongTitle || 'عامر منيب - حب العمر 🎵';

  // Autoplay engine: Starts the song as soon as the site opens, with immediate fallback on first touch/click
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.75;

    // 1. Attempt immediate autoplay on site load
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser requires user gesture first.
          // Listen for the very first interaction anywhere on the document to start immediately.
          const handleFirstGesture = () => {
            if (audio.paused) {
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
            }
            window.removeEventListener('click', handleFirstGesture);
            window.removeEventListener('touchstart', handleFirstGesture);
            window.removeEventListener('keydown', handleFirstGesture);
          };

          window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
          window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
          window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
        });
    }

    return () => {};
  }, [activeSongUrl]);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    audio.muted = next;
    setIsMuted(next);
  };

  const handleEnsureAudioStarted = () => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // If no user is logged in, show the romantic Login Gateway screen
  if (!userSession) {
    return (
      <div className="min-h-screen bg-[#0b0612] text-[#fce7f3] relative overflow-hidden">
        {/* Global Persistent Audio Element */}
        <audio
          ref={audioRef}
          src={activeSongUrl}
          loop
          preload="auto"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Ambient floating hearts in the background */}
        <FloatingHeartsCanvas />
        <LoginGateway
          onLogin={handleLogin}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          songTitle={activeSongTitle}
          onUserGesture={handleEnsureAudioStarted}
          partnerName={config.partnerName}
          senderName={config.senderName}
        />
      </div>
    );
  }

  const effectiveRole = isPreviewingAsViewer ? 'viewer' : userSession?.role;
  const canEdit = effectiveRole === 'admin';

  return (
    <div className="min-h-screen bg-[#0b0612] text-[#fce7f3] selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* Global Persistent Audio Element */}
      <audio
        ref={audioRef}
        src={activeSongUrl}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dynamic Floating Hearts Canvas Background */}
      <FloatingHeartsCanvas />

      {/* Top Navbar with integrated responsive Music Player */}
      <Navbar
        partnerName={config.partnerName}
        onOpenCustomizer={() => handleOpenCustomizer('basic')}
        customSongUrl={activeSongUrl}
        customSongTitle={activeSongTitle}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={handleTogglePlay}
        onToggleMute={handleToggleMute}
        userSession={userSession}
        onLogout={handleLogout}
        isPreviewingAsViewer={isPreviewingAsViewer}
        onTogglePreview={() => setIsPreviewingAsViewer((prev) => !prev)}
      />

      {/* Preview mode alert bar if Faress is previewing as Ayweya */}
      {isPreviewingAsViewer && (
        <div className="sticky top-12 sm:top-14 z-20 w-full bg-purple-950/90 border-b border-purple-600/40 py-2 px-3 sm:px-4 text-center text-xs text-purple-200 flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-md">
          <span>👁️ أنت دلوقتي في وضع المعاينة (زي ما أيويه هتشوف الموقع)</span>
          <button
            onClick={() => setIsPreviewingAsViewer(false)}
            className="px-2.5 py-0.5 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-bold cursor-pointer transition-colors text-xs"
          >
            الرجوع للتعديل
          </button>
        </div>
      )}

      <main className="relative z-10 w-full overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection
          partnerName={config.partnerName}
          senderName={config.senderName}
          birthDate={config.birthDate}
          anniversaryDate={config.anniversaryDate}
          headline={config.mainHeadline}
          subtitle={config.subtitle}
          kickerText={config.kickerText}
          openLetterButtonText={config.openLetterButtonText}
          timeTogetherTitle={config.timeTogetherTitle}
          timeTogetherSubtitle={config.timeTogetherSubtitle}
          timeTogetherLabel={config.timeTogetherLabel}
          timeTogetherPoem={config.timeTogetherPoem}
          countdownTitle={config.countdownTitle}
          countdownPoem={config.countdownPoem}
          onOpenLetter={() => setIsLetterModalOpen(true)}
          userSession={isPreviewingAsViewer ? { ...userSession, role: 'viewer' } : userSession}
          onEditSection={canEdit ? handleOpenCustomizer : undefined}
        />

        {/* Love Letter Section */}
        <LoveLetterSection
          partnerName={config.partnerName}
          senderName={config.senderName}
          title={config.loveMessageTitle}
          customMessage={config.loveMessageBody}
          loveVerseText={config.loveVerseText}
          canEdit={canEdit}
          onEditSection={canEdit ? handleOpenCustomizer : undefined}
        />

        {/* Gallery Section */}
        <GallerySection
          memories={memories}
          onAddMemory={handleAddMemory}
          onAddMultipleMemories={(newBatch) => {
            const updated = [...newBatch, ...memories];
            setMemories(updated);
            try {
              localStorage.setItem('romantic_bday_memories', JSON.stringify(updated));
            } catch (e) {
              console.error(e);
            }
            fetch('/api/memories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            }).catch((err) => console.error('Failed to sync multiple memories:', err));
            showToast('تمت إضافة الصور وحفظها نهائياً! 📸✨');
          }}
          onUpdateMemory={handleUpdateMemory}
          onDeleteMemory={handleDeleteMemory}
          canEdit={canEdit}
          galleryTitle={config.galleryTitle}
          gallerySubtitle={config.gallerySubtitle}
          onEditSection={canEdit ? handleOpenCustomizer : undefined}
        />

        {/* Reasons Why I Love You Section */}
        <ReasonsWhySection
          reasons={config.reasonsWhy}
          canEdit={canEdit}
          reasonsTitle={config.reasonsTitle}
          reasonsSubtitle={config.reasonsSubtitle}
          onEditSection={canEdit ? handleOpenCustomizer : undefined}
        />

        {/* Birthday Cake & Candle Section */}
        <BirthdayWishSection
          partnerName={config.partnerName}
          cakeMessage={config.cakeMessage}
          wishMessageBody={config.wishMessageBody}
          wishSectionTitle={config.wishSectionTitle}
          wishSectionSubtitle={config.wishSectionSubtitle}
          canEdit={canEdit}
          onEditSection={canEdit ? handleOpenCustomizer : undefined}
        />
      </main>

      {/* Footer */}
      <Footer
        partnerName={config.partnerName}
        senderName={config.senderName}
        footerLoveText={config.footerLoveText}
        footerSubtext={config.footerSubtext}
        canEdit={canEdit}
        onEditSection={canEdit ? handleOpenCustomizer : undefined}
      />

      {/* Floating Action Button to edit anything from anywhere on desktop and mobile */}
      {canEdit && (
        <aside
          aria-label="أدوات تحكم المشرف"
          className="fixed bottom-4 left-3 sm:bottom-5 sm:left-5 z-40 animate-in fade-in slide-in-from-bottom duration-300"
        >
          <button
            type="button"
            onClick={() => handleOpenCustomizer('basic')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white rounded-full shadow-2xl shadow-rose-950/90 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-xs border border-amber-300/40 text-glow"
            title="تعديل أي محتوى في الموقع"
          >
            <span className="w-2 h-2 rounded-full bg-amber-200 animate-ping" />
            <span>👑 لوحة تعديل الموقع</span>
          </button>
        </aside>
      )}

      {/* Customizer Modal - Only for Faress (Admin) */}
      {canEdit && (
        <CustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          config={config}
          onSaveConfig={handleSaveConfig}
          onResetDefaults={handleResetDefaults}
          initialTab={customizerTab}
          uploadedAudioUrl={uploadedAudioUrl}
          uploadedAudioName={uploadedAudioName}
          onAudioUploaded={handleAudioUploaded}
          onAudioRemoved={handleAudioRemoved}
          memories={memories}
          onSaveMemories={handleSaveMemories}
          onImportBackup={(importedConfig, importedMemories) => {
            handleSaveConfig(importedConfig);
            if (importedMemories && Array.isArray(importedMemories)) {
              setMemories(importedMemories);
              try {
                localStorage.setItem('romantic_bday_memories', JSON.stringify(importedMemories));
              } catch (e) {
                console.error(e);
              }
              fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(importedMemories),
              }).catch(console.error);
            }
            showToast('تمت استعادة وتطبيق النسخة الاحتياطية بنجاح! 💾✨');
          }}
        />
      )}

      {/* Floating Save/Status Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/95 to-neutral-900/95 border border-emerald-400/60 text-emerald-200 text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top duration-300 text-center"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <LoveLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        partnerName={config.partnerName}
        senderName={config.senderName}
        messageBody={config.envelopeLetterBody || DEFAULT_ENVELOPE_LETTER}
        canEdit={canEdit}
        onEditLetter={() => handleOpenCustomizer('letters')}
      />
    </div>
  );
}
