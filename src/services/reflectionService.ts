import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export interface ReflectionPrompt {
  source: string;
  content: string;
  prompt: string;
}

const PROMPTS: ReflectionPrompt[] = [
  {
    source: "Quran 2:152",
    content: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    prompt: "How can you manifest gratitude in your actions today?"
  },
  {
    source: "Hadith (Bukhari)",
    content: "The best among you are those who learn the Quran and teach it.",
    prompt: "What is one small way you can share your knowledge with someone else today?"
  },
  {
    source: "Quran 94:5-6",
    content: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    prompt: "Reflect on a recent challenge. What 'ease' or lesson did it bring into your life?"
  },
  {
    source: "Hadith (Muslim)",
    content: "Purity is half of faith.",
    prompt: "In what way can you purify your intentions for your tasks today?"
  },
  {
    source: "Quran 13:28",
    content: "Unquestionably, by the remembrance of Allah hearts are assured.",
    prompt: "When did you last feel true peace? What was the state of your remembrance then?"
  }
];

export function getDailyPrompt(): ReflectionPrompt {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return PROMPTS[dayOfYear % PROMPTS.length];
}

export async function saveJournalEntry(content: string, prompt: ReflectionPrompt) {
  if (!auth.currentUser) throw new Error("Authentication required");

  const today = new Date().toISOString().split('T')[0];
  const journalRef = collection(db, 'users', auth.currentUser.uid, 'journal');

  await addDoc(journalRef, {
    userId: auth.currentUser.uid,
    content,
    prompt: prompt.prompt,
    source: prompt.source,
    date: today,
    createdAt: serverTimestamp()
  });
}

export async function getRecentEntries(count: number = 3) {
  if (!auth.currentUser) return [];

  const journalRef = collection(db, 'users', auth.currentUser.uid, 'journal');
  const q = query(journalRef, orderBy('createdAt', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
