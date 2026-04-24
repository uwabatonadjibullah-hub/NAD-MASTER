import { TrendingUp, Book, Activity, CheckCircle2, XCircle, Quote, Sparkles, PenTool, Loader2, Save, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDailyPrompt, saveJournalEntry, getRecentEntries, ReflectionPrompt } from '../services/reflectionService';
import { cn } from '../lib/utils';

export default function Home() {
  const [prompt, setPrompt] = useState<ReflectionPrompt>(getDailyPrompt());
  const [journalContent, setJournalContent] = useState('');
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    const entries = await getRecentEntries(2);
    setRecentEntries(entries);
  };

  const handleSave = async () => {
    if (!journalContent.trim()) return;
    setIsSaving(true);
    try {
      await saveJournalEntry(journalContent, prompt);
      setJournalContent('');
      setSaveSuccess(true);
      loadRecent();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* Daily Reflection & Journaling (DYNAMIC) */}
        <div className="ledger-card bg-secondary/5 border-secondary/10 flex flex-col justify-between overflow-hidden relative">
          <Sparkles className="absolute top-4 right-4 text-secondary/20" size={32} />
          
          <div className="space-y-4">
            <span className="label-caps !text-secondary">Daily Reflection</span>
            <blockquote className="text-xl font-serif italic leading-snug">
              "{prompt.content}"
            </blockquote>
            <p className="text-[10px] label-caps opacity-40">— {prompt.source}</p>
          </div>

          <div className="mt-8 space-y-3">
             <div className="flex items-center gap-2 mb-1">
                <PenTool size={14} className="text-secondary opacity-60" />
                <span className="text-xs font-serif font-bold italic">{prompt.prompt}</span>
             </div>
             <textarea 
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Journal your thoughts..."
                className="w-full p-3 bg-surface rounded border border-outline/10 text-sm italic focus:ring-1 focus:ring-secondary/30 transition-all resize-none min-h-[80px]"
             />
             <div className="flex justify-between items-center px-1">
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i < recentEntries.length ? "bg-secondary" : "bg-outline/20"
                      )} 
                      title={i < recentEntries.length ? "Recent entry" : "No entry"} 
                    />
                  ))}
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !journalContent.trim()}
                  className={cn(
                    "px-4 py-1.5 label-caps !text-[10px] rounded transition-all flex items-center gap-2",
                    saveSuccess ? "bg-green-600 text-white" : "bg-secondary text-on-secondary hover:opacity-90"
                  )}
                >
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : saveSuccess ? "Recorded" : "Record"}
                </button>
             </div>
          </div>
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
