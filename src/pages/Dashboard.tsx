import { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle2, Circle, XCircle, Plus, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import {
  collection, onSnapshot, addDoc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { cn } from '../lib/utils';

interface Goal {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'failed';
  userId: string;
  createdAt: any;
}

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState('');
  const [adding, setAdding] = useState(false);
  const user = auth.currentUser;

  // Real-time Firestore listener
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'goals'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() } as Goal)));
      setLoading(false);
    }, (err) => {
      console.error('Goals listener error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const active = goals.filter(g => g.status === 'active');
  const completed = goals.filter(g => g.status === 'completed');
  const failed = goals.filter(g => g.status === 'failed');
  const total = goals.length;
  const completionPct = total > 0 ? Math.round((completed.length / total) * 100) : 0;
  // SVG circle: r=45, circumference ≈ 282.7
  const dashOffset = 282.7 - (282.7 * completionPct) / 100;

  const addGoal = async () => {
    if (!newGoal.trim() || !user) return;
    setAdding(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'goals'), {
        title: newGoal.trim(),
        status: 'active',
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewGoal('');
    } catch (e) {
      console.error('Failed to add goal:', e);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-serif font-bold">Dashboard</h2>
        <p className="text-on-surface-variant">Real-time overview of your discipline and goals.</p>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Goals', value: total, color: 'text-on-surface' },
          { label: 'Active', value: active.length, color: 'text-primary' },
          { label: 'Completed', value: completed.length, color: 'text-green-400' },
          { label: 'Failed', value: failed.length, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="ledger-card text-center py-6">
            <span className={cn('text-4xl font-serif font-light', stat.color)}>{stat.value}</span>
            <p className="label-caps !text-[10px] mt-2 text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Ring */}
        <div className="md:col-span-2 ledger-card">
          <h3 className="text-2xl font-serif font-bold mb-4">Goals Completion</h3>
          <div className="flex flex-col md:flex-row items-center gap-12 mt-8">
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#373433" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="#d6c3b5" strokeWidth="8"
                  strokeDasharray="282.7"
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-serif font-bold">{completionPct}%</span>
                <span className="text-xs text-on-surface-variant mt-1">complete</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium text-lg">On Track ({active.length})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-lg">Completed ({completed.length})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-on-surface-variant text-lg">Failed ({failed.length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual tally */}
        <div className="ledger-card flex flex-col justify-between">
          <h3 className="text-2xl font-serif font-bold">Annual Tally</h3>
          <div className="mt-8 flex flex-col items-center md:items-start">
            <span className="text-7xl font-serif font-light mb-2">{completed.length}</span>
            <span className="label-caps">Completed Disciplines</span>
          </div>
        </div>
      </section>

      {/* Add a new goal */}
      <section className="ledger-card space-y-4">
        <h3 className="text-xl font-serif font-bold">Add New Goal</h3>
        <div className="flex gap-3">
          <input
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder="e.g. Memorize Surah Al-Mulk..."
            className="flex-1 bg-transparent border-b-2 border-outline/30 focus:border-primary focus:outline-none py-2 text-on-surface transition-colors"
          />
          <button
            onClick={addGoal}
            disabled={adding || !newGoal.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold disabled:opacity-50 transition-opacity"
          >
            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add
          </button>
        </div>
      </section>

      {/* Goals Overview */}
      <section className="ledger-card">
        <div className="flex items-center gap-3 border-b border-outline/10 pb-6 mb-8">
          <LayoutDashboard className="text-primary" size={24} />
          <h3 className="text-2xl font-serif font-bold">Goals Overview</h3>
        </div>

        {total === 0 ? (
          <p className="text-center text-on-surface-variant py-12 text-lg">
            No goals yet — add your first goal above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Active */}
            <div className="space-y-6">
              <h4 className="label-caps border-b border-outline/10 pb-2">Active Goals</h4>
              {active.length === 0 ? (
                <p className="text-sm text-on-surface-variant/60 italic">No active goals.</p>
              ) : (
                <ul className="space-y-4">
                  {active.map(goal => (
                    <li key={goal.id} className="flex items-start gap-4">
                      <Circle size={20} className="text-outline mt-1 shrink-0" />
                      <span className="leading-tight">{goal.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Completed */}
            <div className="space-y-6">
              <h4 className="label-caps border-b border-outline/10 pb-2">Completed Goals</h4>
              {completed.length === 0 ? (
                <p className="text-sm text-on-surface-variant/60 italic">None completed yet.</p>
              ) : (
                <ul className="space-y-4">
                  {completed.map(goal => (
                    <li key={goal.id} className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-green-400 mt-1 shrink-0" />
                      <span className="leading-tight">{goal.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Failed */}
            <div className="space-y-6">
              <h4 className="label-caps border-b border-outline/10 pb-2">Failed Goals</h4>
              {failed.length === 0 ? (
                <p className="text-sm text-on-surface-variant/60 italic">None failed. Keep it up!</p>
              ) : (
                <ul className="space-y-4">
                  {failed.map(goal => (
                    <li key={goal.id} className="flex items-start gap-4">
                      <XCircle size={20} className="text-red-400 mt-1 shrink-0" />
                      <span className="leading-tight text-on-surface-variant/70">{goal.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
