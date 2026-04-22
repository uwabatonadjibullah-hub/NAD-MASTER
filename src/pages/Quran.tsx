import { BookOpen, Check, ChevronUp, Info, ChevronRight, Hand } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Quran() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <section className="space-y-4 text-center md:text-left">
        <h2 className="text-4xl font-serif font-bold">Quran Tracking</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto md:mx-0">
          Monitor your progression, stay aligned with your goals, and review your daily commitments with discipline.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ledger-card flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="label-caps">Overall Completion</span>
            <BookOpen className="text-secondary" size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-serif font-bold">32%</span>
            <span className="text-sm text-on-surface-variant">9 Juzz completed</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full w-[32%]" />
          </div>
        </div>

        <div className="md:col-span-2 ledger-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="label-caps">Performance over time</span>
            <div className="text-right">
              <div className="text-2xl font-serif font-bold">145</div>
              <div className="label-caps !text-[10px]">Verses this week</div>
            </div>
          </div>
          {/* Simple Chart Visualization */}
          <div className="h-24 w-full mt-6 flex items-end justify-between px-2 pb-6 border-b border-outline/10 overflow-hidden relative">
            {[30, 45, 50, 60, 70, 65, 80].map((height, i) => (
              <div 
                key={i} 
                style={{ height: `${height}%` }}
                className="w-1/12 bg-primary/40 rounded-t-sm transition-all hover:bg-primary"
              />
            ))}
          </div>
          <div className="flex justify-between px-2 mt-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <span key={day} className="label-caps !text-[10px] opacity-40">{day}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Juzz Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end border-b border-outline/10 pb-2">
            <h3 className="text-2xl font-serif font-bold">Juzz Progression</h3>
            <span className="label-caps !text-[10px]">30 Total</span>
          </div>

          <div className="space-y-3">
            {[1, 2].map(num => (
              <div key={num} className="ledger-card !p-4 flex justify-between items-center group cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Check size={14} className="text-on-surface" />
                  </div>
                  <span className="font-medium">Juzz {num} - {num === 1 ? 'Al Fatiha / Al Baqarah' : 'Al Baqarah'}</span>
                </div>
                <ChevronRight size={18} className="text-outline group-hover:text-primary transition-colors" />
              </div>
            ))}

            {/* Expanded Current Juzz */}
            <div className="ledger-card !p-0 border-primary/30 overflow-hidden">
              <div className="p-4 flex justify-between items-center bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10 ml-1" />
                  <span className="font-bold">Juzz 10 - Al Anfal</span>
                </div>
                <ChevronUp size={20} className="text-primary" />
              </div>
              <div className="px-10 py-4 space-y-2">
                {[
                  { title: 'Surah Al-Anfal (8:41 - 8:75)', done: true },
                  { title: 'Surah At-Tawbah (9:1 - 9:33)', done: false },
                  { title: 'Surah At-Tawbah (9:34 - 9:92)', done: false },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-outline/5 last:border-0">
                    <span className={cn("text-sm", item.done ? "text-on-surface-variant" : "text-on-surface font-medium")}>
                      {item.title}
                    </span>
                    <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", 
                      item.done ? "bg-primary/20 border-primary" : "border-outline")}>
                      {item.done && <Check size={12} className="text-primary" />}
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 py-3 bg-primary text-on-primary label-caps tracking-[0.2em] rounded hover:opacity-90 transition-opacity">
                  Mark Current Session Complete
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="ledger-card space-y-6">
            <h3 className="text-xl font-serif font-bold border-b border-outline/10 pb-2">Commitment Review</h3>
            <p className="text-sm italic text-on-surface-variant opacity-70">Pace: 1 Juzz per week</p>
            
            <div className="relative h-32 border-b border-outline/10 flex items-end">
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 5 85 C 30 85, 40 45, 95 10" fill="none" stroke="#D5CEA3" strokeDasharray="4 4" strokeOpacity="0.4" strokeWidth="2" />
                <path d="M 5 85 C 30 85, 45 70, 95 55" fill="none" stroke="#D5CEA3" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 border-t-2 border-dashed border-primary/40" />
                <span className="text-[9px] label-caps !opacity-50">Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary" />
                <span className="text-[9px] label-caps">Actual</span>
              </div>
            </div>

            <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg flex items-start gap-3">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                You are currently <strong>2 Juzz behind</strong> your scheduled target. Increase daily reading to realign.
              </p>
            </div>
          </div>

          <div className="ledger-card space-y-6">
             <div className="flex justify-between items-center border-b border-outline/10 pb-2">
              <h3 className="text-xl font-serif font-bold">Daily Duas</h3>
              <Hand size={18} className="text-secondary" />
            </div>
            <ul className="space-y-4">
              {['Rabbana Atina Fid Dunya Hasanah...', 'Allahumma Inni As\'aluka Al Afiyah...'].map((dua, i) => (
                <li key={i} className="flex items-start gap-3 group cursor-pointer hover:text-primary transition-colors">
                  <div className="w-2 h-2 bg-secondary rotate-45 mt-2 shrink-0 group-hover:bg-primary transition-colors" />
                  <span className="text-sm">{dua}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 opacity-40 italic">
                <div className="w-1.5 h-1.5 border border-outline rotate-45 mt-2 shrink-0" />
                <span className="text-xs">Dua before sleeping</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
