import { useState } from 'react';
import { Sun, Moon, Bed, ChevronRight, Bookmark, ShieldCheck, Heart, MoonStar, HandHeart, X, ChevronLeft } from 'lucide-react';

interface DhikrItem {
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  virtue?: string;
}

const ADHKAR_DATA: Record<string, DhikrItem[]> = {
  Morning: [
    { arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', transliteration: "Asbahna wa asbahal mulku lillah", translation: "We have entered the morning and the dominion belongs to Allah.", count: 1 },
    { arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا', transliteration: "Allahumma bika asbahna, wa bika amsayna", translation: "O Allah, by You we enter the morning and by You we enter the evening.", count: 1 },
    { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: "SubhanAllahi wa bihamdih", translation: "Glory be to Allah and praise be to Him.", count: 100, virtue: "Sins are forgiven even if they are like the foam of the sea." },
    { arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', transliteration: "A'udhu bikalimatillahi't-tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", count: 3, virtue: "Nothing will harm you until morning." },
    { arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ', transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un", translation: "In the name of Allah, with Whose name nothing can cause harm.", count: 3, virtue: "No sudden affliction will harm you." },
    { arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ نَبِيًّا', transliteration: "Raditu billahi rabban, wa bil-islami dinan, wa bi-Muhammadin nabiyya", translation: "I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet.", count: 3, virtue: "Allah will be pleased with you on the Day of Judgement." },
    { arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ', transliteration: "Allahumma anta Rabbi la ilaha illa ant", translation: "O Allah, You are my Lord. There is none worthy of worship except You.", count: 1, virtue: "Sayyid al-Istighfar — if recited with conviction and you die that day, you will be of the people of Paradise." },
    { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration: "La ilaha illAllahu wahdahu la sharika lah", translation: "There is none worthy of worship except Allah, alone, with no partner.", count: 10, virtue: "Equal to freeing 4 slaves, 100 good deeds written, 100 bad deeds erased." },
  ],
  Evening: [
    { arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', transliteration: "Amsayna wa amsal mulku lillah", translation: "We have entered the evening and the dominion belongs to Allah.", count: 1 },
    { arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا', transliteration: "Allahumma bika amsayna wa bika asbahna", translation: "O Allah, by You we enter the evening and by You we enter the morning.", count: 1 },
    { arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', transliteration: "A'udhu bikalimatillahi't-tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", count: 3 },
    { arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ', transliteration: "Allahumma inni amsaytu ush-hiduk", translation: "O Allah, I have entered the evening calling You to witness.", count: 4, virtue: "Allah will forgive your sins of that day or night." },
    { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: "SubhanAllahi wa bihamdih", translation: "Glory be to Allah and praise be to Him.", count: 100 },
  ],
  'Before Sleep': [
    { arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: "Bismika Allahumma amutu wa ahya", translation: "In Your name, O Allah, I die and I live.", count: 1 },
    { arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak", translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.", count: 3 },
    { arabic: 'سُبْحَانَ اللَّهِ', transliteration: "SubhanAllah", translation: "Glory be to Allah.", count: 33, virtue: "Better than a servant for the people of the house." },
    { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: "Alhamdulillah", translation: "Praise be to Allah.", count: 33 },
    { arabic: 'اللَّهُ أَكْبَرُ', transliteration: "Allahu Akbar", translation: "Allah is the Greatest.", count: 34 },
    { arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ', transliteration: "Allahumma aslamtu nafsi ilayk", translation: "O Allah, I have submitted myself to You.", count: 1, virtue: "If you die that night, you die on the fitrah." },
  ],
  Tahajjud: [
    { arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالْأَرْضِ', transliteration: "Allahumma lakal-hamdu anta qayyimus-samawati wal-ard", translation: "O Allah, to You belongs praise. You are the Sustainer of the heavens and the earth.", count: 1 },
    { arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ', transliteration: "Subhanakal-lahumma wa bihamdik", translation: "How perfect are You O Allah, and I praise You.", count: 1 },
  ],
  Istighfar: [
    { arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah.", count: 100, virtue: "Prophet ﷺ sought forgiveness 100 times a day." },
    { arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', transliteration: "Astaghfirullaha wa atubu ilayh", translation: "I seek forgiveness from Allah and repent to Him.", count: 100 },
    { arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', transliteration: "Rabbighfirli wa tub 'alayya innaka antat-Tawwabur-Rahim", translation: "My Lord, forgive me and accept my repentance. Indeed You are the Oft-Returning, the Merciful.", count: 100 },
  ],
  'All-times Dhikr': [
    { arabic: 'سُبْحَانَ اللَّهِ', transliteration: "SubhanAllah", translation: "Glory be to Allah.", count: 33 },
    { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: "Alhamdulillah", translation: "All praise is for Allah.", count: 33 },
    { arabic: 'اللَّهُ أَكْبَرُ', transliteration: "Allahu Akbar", translation: "Allah is the Greatest.", count: 34 },
    { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: "La ilaha illAllah", translation: "There is none worthy of worship except Allah.", count: 100, virtue: "Fills the scales on the Day of Judgment." },
    { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: "La hawla wa la quwwata illa billah", translation: "There is no power or might except with Allah.", count: 100, virtue: "A treasure from the treasures of Paradise." },
  ],
};

function SessionModal({ category, onClose }: { category: string; onClose: () => void }) {
  const items = ADHKAR_DATA[category] || [];
  const [index, setIndex] = useState(0);
  const [tapped, setTapped] = useState(0);
  const current = items[index];
  const target = current?.count ?? 1;
  const done = tapped >= target;

  const handleTap = () => {
    if (done) return;
    setTapped(t => t + 1);
  };

  const next = () => {
    if (index < items.length - 1) { setIndex(i => i + 1); setTapped(0); }
    else onClose();
  };

  const prev = () => {
    if (index > 0) { setIndex(i => i - 1); setTapped(0); }
  };

  if (!current) return null;
  const progress = Math.min(tapped / target, 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#1a120b] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="label-caps !text-[10px] text-primary">{category} — {index + 1}/{items.length}</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((index) / items.length) * 100}%` }} />
        </div>

        {/* Arabic */}
        <div className="text-center space-y-3 py-4">
          <p className="text-4xl leading-relaxed font-arabic text-[#e7e1e0]" dir="rtl">{current.arabic}</p>
          <p className="text-sm text-primary/80 italic">{current.transliteration}</p>
          <p className="text-base text-on-surface-variant">{current.translation}</p>
          {current.virtue && (
            <p className="text-xs text-[#d6c3b5]/60 bg-white/5 rounded-lg p-3 mt-2">{current.virtue}</p>
          )}
        </div>

        {/* Counter tap */}
        <button
          onClick={handleTap}
          disabled={done}
          className={`w-full py-6 rounded-xl border-2 font-serif text-3xl font-bold transition-all active:scale-95 ${
            done ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {done ? '✓ Done' : `${tapped} / ${target}`}
        </button>

        {/* Nav */}
        <div className="flex gap-3">
          <button onClick={prev} disabled={index === 0} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all disabled:opacity-30 flex items-center justify-center gap-2">
            <ChevronLeft size={16} /> Prev
          </button>
          <button onClick={next} className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            {index < items.length - 1 ? 'Next' : 'Finish'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const primaryAdhkar = [
  { title: 'Morning', sub: 'Start your day with remembrance and protection.', icon: Sun, type: 'daily', count: ADHKAR_DATA.Morning.length },
  { title: 'Evening', sub: 'Close the day seeking forgiveness and peace.', icon: Moon, type: 'daily', count: ADHKAR_DATA.Evening.length },
  { title: 'Before Sleep', sub: 'Restful supplications for a peaceful night.', icon: Bed, type: 'nightly', count: ADHKAR_DATA['Before Sleep'].length },
];

const categories = [
  { title: 'Tahajjud Duas', sub: 'Supplications for the night prayer.', icon: MoonStar, key: 'Tahajjud' },
  { title: 'Istighfar', sub: 'Seeking forgiveness continuously.', icon: ShieldCheck, key: 'Istighfar' },
  { title: 'All-times Dhikr', sub: 'General remembrance throughout the day.', icon: Heart, key: 'All-times Dhikr' },
  { title: 'Quranic Duas', sub: 'Supplications found in the Holy Quran.', icon: Bookmark, key: null },
  { title: 'Before/After Salah', sub: 'Dhikr connected to obligatory prayers.', icon: HandHeart, key: null },
  { title: 'Ruqiyah', sub: 'Recitations for spiritual healing.', icon: ShieldCheck, key: null },
];

export default function Dhikr() {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      {activeSession && (
        <SessionModal category={activeSession} onClose={() => setActiveSession(null)} />
      )}

      <header className="text-center space-y-3">
        <h2 className="text-5xl font-serif font-bold text-primary">Dhikr & Adhkar</h2>
        <p className="text-on-surface-variant text-lg">Daily remembrances and supplications.</p>
      </header>

      {/* Primary Adhkar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {primaryAdhkar.map((item) => (
          <div key={item.title} className="ledger-card group relative hover:bg-surface-container-high transition-colors overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <item.icon size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="label-caps !text-[10px] text-secondary">{item.type}</span>
              <h3 className="text-3xl font-serif font-bold text-primary">{item.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.sub}</p>
              <p className="text-xs text-on-surface-variant/50">{item.count} adhkar</p>
              <button
                onClick={() => setActiveSession(item.title)}
                className="flex items-center gap-2 text-primary font-bold text-sm pt-4 hover:gap-3 transition-all"
              >
                <span>Begin</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold border-b border-primary/10 pb-2">Additional Supplications</h3>
        <div className="bg-[#100e0d] border border-outline/10 rounded-xl overflow-hidden divide-y divide-outline/5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              onClick={() => cat.key && setActiveSession(cat.key)}
              className={`flex items-center justify-between p-5 transition-colors ${cat.key ? 'hover:bg-surface-container cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-outline/5">
                  <cat.icon size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-primary">{cat.title}</h4>
                  <p className="text-sm text-on-surface-variant">{cat.sub}</p>
                </div>
              </div>
              <ChevronRight className="text-outline/50" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
