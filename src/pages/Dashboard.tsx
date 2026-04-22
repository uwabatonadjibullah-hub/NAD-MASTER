import { LayoutDashboard, CheckCircle2, Circle, XCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-serif font-bold">Dashboard</h2>
        <p className="text-on-surface-variant">Overview of your current discipline and goals.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 ledger-card">
          <h3 className="text-2xl font-serif font-bold mb-4">Current Goals Completion</h3>
          <div className="flex flex-col md:flex-row items-center gap-12 mt-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#373433" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#d6c3b5" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="70.6" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-serif font-bold">75%</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium text-lg">On Track (6)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-surface-variant" />
                <span className="text-on-surface-variant text-lg">Behind (2)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ledger-card flex flex-col justify-between">
          <h3 className="text-2xl font-serif font-bold">Annual Tally</h3>
          <div className="mt-8 flex flex-col items-center md:items-start">
            <span className="text-7xl font-serif font-light mb-2">42</span>
            <span className="label-caps">Completed Disciplines</span>
          </div>
        </div>
      </section>

      <section className="ledger-card">
        <div className="flex items-center gap-3 border-b border-outline/10 pb-6 mb-8">
          <LayoutDashboard className="text-primary" size={24} />
          <h3 className="text-2xl font-serif font-bold">Goals Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Active Goals */}
          <div className="space-y-6">
            <h4 className="label-caps border-b border-outline/10 pb-2">Active Goals</h4>
            <ul className="space-y-4">
              {['Memorize Surah Al-Mulk', 'Read 10 pages of Tafsir weekly', 'Maintain daily morning Adhkar'].map(goal => (
                <li key={goal} className="flex items-start gap-4">
                  <Circle size={20} className="text-outline mt-1 shrink-0" />
                  <span className="leading-tight">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Completed Goals */}
          <div className="space-y-6">
            <h4 className="label-caps border-b border-outline/10 pb-2">Completed Goals</h4>
            <ul className="space-y-4">
              {['Complete Surah Yaseen memorization', 'Attend 4 weekend Islamic seminars'].map(goal => (
                <li key={goal} className="flex items-start gap-4">
                  <CheckCircle2 size={20} className="text-primary mt-1 shrink-0" />
                  <span className="leading-tight">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Failed Goals */}
          <div className="space-y-6">
            <h4 className="label-caps border-b border-outline/10 pb-2">Failed Goals</h4>
            <ul className="space-y-4">
              {['Fast every Monday and Thursday for a month'].map(goal => (
                <li key={goal} className="flex items-start gap-4">
                  <XCircle size={20} className="text-error mt-1 shrink-0" />
                  <span className="leading-tight text-on-surface-variant/70">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
