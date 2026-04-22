import { TrendingUp, Book, Activity, CheckCircle2, XCircle, Quote } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Weekly Rate', value: '88%', color: 'secondary' },
    { label: 'Discipline Score', value: '85', color: 'primary' },
    { label: 'Completed Sessions', value: '12/14', color: 'outline' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Date Header */}
      <div className="flex flex-col">
        <p className="text-on-surface-variant/70 text-sm font-medium">
          5 Dhu al-Qi'dah 1447 AH • Wednesday, April 22, 2026
        </p>
      </div>

      {/* Performance Trend */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 ledger-card flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Performance Trend</h2>
            <p className="text-on-surface-variant mb-6">Consistency is key. Great job this week!</p>
          </div>
          <div className="flex flex-wrap justify-around items-center gap-6 mt-2">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full border-4 border-outline/20 flex items-center justify-center relative">
                  <div className={`absolute inset-0 rounded-full border-4 border-${stat.color} border-t-transparent animate-pulse-slow`}></div>
                  <span className="text-2xl font-serif font-bold">{stat.value}</span>
                </div>
                <span className="label-caps text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="ledger-card bg-primary-container/20 border-primary/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Book size={64} />
            </div>
            <span className="label-caps text-secondary block mb-2">Current Session</span>
            <h3 className="text-2xl font-serif font-bold">Quran Memorization</h3>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 bg-on-surface/5 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-1/2"></div>
              </div>
              <span className="text-xs font-bold text-primary">50%</span>
            </div>
          </div>

          <div className="ledger-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Activity size={64} />
            </div>
            <span className="label-caps block mb-2">Next Session</span>
            <h3 className="text-2xl font-serif font-bold">Physical Training</h3>
            <p className="text-on-surface-variant mt-2">18:00 - Upper Body</p>
          </div>
        </div>
      </section>

      {/* Progress & Reflection */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quran Circle */}
        <div className="bg-[#2d241c] rounded-2xl p-8 text-[#e7e1e0] border border-outline/10 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#4caf50" strokeWidth="2" strokeDasharray="30, 100" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-[#4caf50]">30%</span>
            </div>
          </div>
          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-on-surface-variant">Current Surah:</span>
              <span className="text-[#4caf50] font-medium">Al-Humazah</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-on-surface-variant">Current Juzz:</span>
              <span className="text-primary font-medium">Juzz 30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Memorized:</span>
              <span className="text-secondary font-medium">48/6236</span>
            </div>
          </div>
        </div>

        {/* Hadith Reflection */}
        <div className="ledger-card relative overflow-hidden flex flex-col justify-center">
          <Quote className="absolute top-4 right-4 text-primary/10" size={48} />
          <span className="label-caps mb-4">Daily Reflection</span>
          <blockquote className="text-2xl font-serif italic leading-relaxed">
            "The most beloved of deeds to Allah are those that are most consistent, even if it is small."
          </blockquote>
          <cite className="text-on-surface-variant mt-4 block not-italic">— Sahih Bukhari</cite>
        </div>
      </section>

      {/* Goal Lists */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="ledger-card">
          <h2 className="text-2xl font-serif font-bold mb-4">Completed Goals</h2>
          <ul className="space-y-3">
            {['Fajr in Jama\'ah', 'Read 1 Book Chapter'].map(goal => (
              <li key={goal} className="flex items-center gap-3 p-4 bg-surface/30 rounded border border-outline/10">
                <CheckCircle2 className="text-secondary" size={20} />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ledger-card">
          <h2 className="text-2xl font-serif font-bold mb-4">Failed Goals</h2>
          <ul className="space-y-3">
            {['Review 2 pages of Quran', 'Evening Adhkar'].map(goal => (
              <li key={goal} className="flex items-center gap-3 p-4 bg-surface/30 rounded border border-outline/10">
                <XCircle className="text-error" size={20} />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
