import { useState, useEffect, useRef } from 'react';
import { BookOpen, Check, ChevronUp, Info, ChevronRight, Hand, Loader2, Save, Play, Pause, Volume2, Music, Flame, Award, Calendar, Download, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { fetchAudioFiles, getAudioStreamUrl, DriveFile } from '../services/driveService';
import { fetchSurahDetails, SurahInfo } from '../services/quranService';

interface QuranProgress {
  userId: string;
  currentJuzz: number;
  memorizedVerses: number;
  totalVerses: number;
  currentSurah: string;
  dailyTarget: number;
  lastUpdated: any;
  currentStreak: number;
  versesToday: number;
  lastStreakUpdate?: any;
  lastResetDate?: string;
}

export default function Quran() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<QuranProgress | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Audio State
  const [audioFiles, setAudioFiles] = useState<DriveFile[]>([]);
  const [currentAudio, setCurrentAudio] = useState<DriveFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isDownloadingBatch, setIsDownloadingBatch] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Surah Details State
  const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const docRef = doc(db, 'users', auth.currentUser.uid, 'quranProgress', 'main');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as QuranProgress;
        const today = new Date().toISOString().split('T')[0];

        // Daily Reset Logic
        if (data.lastResetDate !== today) {
          updateDoc(docRef, {
            versesToday: 0,
            lastResetDate: today,
          });
        }
        setProgress(data);
      } else {
        const initialProgress: QuranProgress = {
          userId: auth.currentUser!.uid,
          currentJuzz: 1,
          memorizedVerses: 0,
          totalVerses: 6236,
          currentSurah: 'Al-Fatiha',
          dailyTarget: 10,
          lastUpdated: serverTimestamp(),
          currentStreak: 0,
          versesToday: 0,
          lastResetDate: new Date().toISOString().split('T')[0]
        };
        setDoc(docRef, initialProgress);
        setProgress(initialProgress);
      }
      setLoading(false);
    });

    // Load Audio Files
    const loadAudio = async () => {
      const files = await fetchAudioFiles();
      setAudioFiles(files);
    };
    loadAudio();

    return () => unsubscribe();
  }, []);

  // Fetch Surah Info when it changes
  useEffect(() => {
    if (progress?.currentSurah) {
      setLoadingDetails(true);
      fetchSurahDetails(progress.currentSurah).then(info => {
        setSurahInfo(info);
        setLoadingDetails(false);
      });
    }
  }, [progress?.currentSurah]);

  const handleQuickUpdate = async (fields: Partial<QuranProgress>) => {
    if (!auth.currentUser || !progress) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'quranProgress', 'main');
      
      let newVersesToday = progress.versesToday;
      let newStreak = progress.currentStreak;
      let newLastStreakUpdate = progress.lastStreakUpdate;

      // Logic for incrementing verses today and checking streak
      if (fields.memorizedVerses !== undefined) {
        const increment = fields.memorizedVerses - progress.memorizedVerses;
        newVersesToday += increment;

        // Check if target met today and streak not already updated today
        const todayStr = new Date().toISOString().split('T')[0];
        const lastUpdateStr = progress.lastStreakUpdate?.toDate 
          ? progress.lastStreakUpdate.toDate().toISOString().split('T')[0] 
          : '';

        if (newVersesToday >= progress.dailyTarget && lastUpdateStr !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastUpdateStr === yesterdayStr || progress.currentStreak === 0) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          newLastStreakUpdate = serverTimestamp();
        }
      }

      await updateDoc(docRef, {
        ...fields,
        versesToday: newVersesToday,
        currentStreak: newStreak,
        lastStreakUpdate: newLastStreakUpdate,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadFile = async (file: DriveFile) => {
    try {
      const url = getAudioStreamUrl(file.id);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please check your connection.");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedFiles.size === audioFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(audioFiles.map(f => f.id)));
    }
  };

  const downloadSelected = async () => {
    if (selectedFiles.size === 0) return;
    setIsDownloadingBatch(true);
    
    try {
      const filesToDownload = audioFiles.filter(f => selectedFiles.has(f.id));
      for (const file of filesToDownload) {
        await downloadFile(file);
        // Small delay to prevent browser overload
        await new Promise(r => setTimeout(r, 500));
      }
      setSelectedFiles(new Set());
    } catch (error) {
      console.error("Batch download failed:", error);
    } finally {
      setIsDownloadingBatch(false);
    }
  };

  const togglePlay = (file: DriveFile) => {
    if (currentAudio?.id === file.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(file);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = getAudioStreamUrl(file.id);
        audioRef.current.play();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completionPercentage = progress ? Math.round((progress.memorizedVerses / progress.totalVerses) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <section className="space-y-4 text-center md:text-left">
        <h2 className="text-4xl font-serif font-bold">Quran Tracking</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto md:mx-0">
          Monitor your progression, stay aligned with your goals, and review your daily commitments with discipline.
        </p>
      </section>

      {/* Audio Player Section (NEW) */}
      <section className="ledger-card border-secondary/20 overflow-hidden !p-0">
        <div className="bg-secondary/10 p-6 flex items-center justify-between border-b border-secondary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded flex items-center justify-center text-secondary">
              <Music size={24} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold">Study Recordings</h3>
              <p className="text-xs text-on-surface-variant">Audio from your Google Drive folder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {audioFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={selectAll}
                  className="px-3 py-1.5 label-caps !text-[10px] border border-outline/20 rounded hover:bg-surface-container transition-colors"
                >
                  {selectedFiles.size === audioFiles.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedFiles.size > 0 && (
                  <button 
                    onClick={downloadSelected}
                    disabled={isDownloadingBatch}
                    className="px-3 py-1.5 label-caps !text-[10px] bg-primary text-on-primary rounded flex items-center gap-2 animate-in zoom-in-95"
                  >
                    {isDownloadingBatch ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />}
                    Download ({selectedFiles.size})
                  </button>
                )}
              </div>
            )}
            {currentAudio && (
              <div className="hidden lg:flex items-center gap-4 animate-in fade-in zoom-in-95">
              <span className="text-xs font-serif italic truncate max-w-[200px]">Now playing: {currentAudio.name}</span>
              <audio 
                ref={audioRef} 
                onPlay={() => setIsPlaying(true)} 
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                controls className="h-8" 
              />
            </div>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto divide-y divide-outline/10">
          {audioFiles.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Volume2 className="mx-auto text-outline/30" size={48} />
              <p className="text-on-surface-variant italic">No audio files found. Please ensure your Google Drive API key is set and the folder is public.</p>
            </div>
          ) : (
            audioFiles.map((file) => (
              <div key={file.id} 
                className={cn(
                  "p-4 flex items-center justify-between transition-colors hover:bg-secondary/5 group",
                  currentAudio?.id === file.id && "bg-secondary/10"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleSelect(file.id)}
                      className="w-4 h-4 rounded border-outline/30 text-primary focus:ring-primary bg-transparent cursor-pointer"
                    />
                    <button 
                      onClick={() => togglePlay(file)}
                      className="w-10 h-10 rounded-full bg-secondary/80 text-on-secondary flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                      {currentAudio?.id === file.id && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                  </div>
                  <div className="truncate">
                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                    <p className="text-[10px] label-caps opacity-50">Study Resource</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => downloadFile(file)}
                    className="p-2 text-outline/50 hover:text-primary transition-colors"
                    title="Download for offline"
                  >
                    <Download size={18} />
                  </button>
                  <a href={file.webViewLink} target="_blank" rel="noreferrer" className="p-2 text-outline/50 hover:text-secondary transition-colors">
                    <ChevronRight size={18} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Mini Player */}
        {currentAudio && (
          <div className="md:hidden p-4 bg-surface-container border-t border-secondary/20 flex items-center gap-4">
             <button 
                onClick={() => togglePlay(currentAudio)}
                className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] italic truncate">{currentAudio.name}</p>
                <div className="w-full bg-secondary/10 h-1 rounded-full mt-1">
                   <div className="bg-secondary h-full rounded-full w-1/3" />
                </div>
              </div>
          </div>
        )}
      </section>

      {/* Surah Details Section (NEW) */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="ledger-card !p-0 overflow-hidden border-primary/10">
          <button 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info size={18} className="text-primary" />
              <span className="label-caps !text-xs">Surah Insight: {progress?.currentSurah}</span>
            </div>
            {isDetailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {isDetailsOpen && (
            <div className="p-6 border-t border-outline/10 bg-surface-container/30">
              {loadingDetails ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" /></div>
              ) : surahInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="label-caps !text-[10px] opacity-50">Arabic Name</p>
                    <p className="text-3xl font-serif font-bold text-primary">{surahInfo.name_arabic}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="label-caps !text-[10px] opacity-50">Translation</p>
                    <p className="text-lg font-serif">{surahInfo.translated_name.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="label-caps !text-[10px] opacity-50">Verses</p>
                    <p className="text-lg font-serif">{surahInfo.verses_count} Verses</p>
                  </div>
                  <div className="space-y-1">
                    <p className="label-caps !text-[10px] opacity-50">Revelation</p>
                    <p className="text-lg font-serif capitalize">{surahInfo.revelation_place}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                    <a 
                      href={`https://quran.com/${surahInfo.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[10px] label-caps text-primary hover:underline"
                    >
                      Read on Quran.com <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic opacity-50">No details found for "{progress?.currentSurah}".</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Progress Monitor Section */}
      <section className="ledger-card border-primary/20 bg-primary/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold">Active Tracking</h3>
            <p className="text-xs text-on-surface-variant opacity-70 uppercase tracking-widest">User ID: {auth.currentUser?.uid}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="p-4 bg-surface rounded-lg border border-outline/10 text-center min-w-[100px]">
              <span className="label-caps !text-[10px] block mb-1">Current Juzz</span>
              <span className="text-2xl font-serif font-bold">{progress?.currentJuzz}</span>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-outline/10 text-center min-w-[100px]">
              <span className="label-caps !text-[10px] block mb-1">Verses Done</span>
              <span className="text-2xl font-serif font-bold">{progress?.memorizedVerses}</span>
            </div>
            <div className="p-4 bg-[#ff6f00]/10 rounded-lg border border-[#ff6f00]/20 text-center min-w-[100px] flex flex-col items-center justify-center animate-in zoom-in-95">
              <span className="label-caps !text-[10px] text-[#ff6f00] block mb-1 flex items-center gap-1">
                <Flame size={10} fill="currentColor" />
                Streak
              </span>
              <span className="text-2xl font-serif font-bold text-[#ff6f00]">{progress?.currentStreak || 0}</span>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-outline/10 text-center min-w-[100px]">
              <span className="label-caps !text-[10px] block mb-1">Daily Target</span>
              <span className="text-2xl font-serif font-bold">{progress?.dailyTarget}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="label-caps">Today's Progress</span>
                <span className="text-xs font-bold text-primary">{progress?.versesToday} / {progress?.dailyTarget}</span>
              </div>
              {isUpdating && <Loader2 size={16} className="animate-spin text-primary" />}
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
               <div 
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  (progress?.versesToday || 0) >= (progress?.dailyTarget || 0) ? "bg-primary" : "bg-primary/30"
                )} 
                style={{ width: `${Math.min(100, ((progress?.versesToday || 0) / (progress?.dailyTarget || 1)) * 100)}%` }} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleQuickUpdate({ memorizedVerses: (progress?.memorizedVerses || 0) + 1 })}
                className="py-3 px-4 bg-surface-container hover:bg-surface-container-high rounded border border-outline/10 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                <span className="label-caps !text-[10px]">+1 Verse</span>
              </button>
              <button 
                onClick={() => handleQuickUpdate({ currentJuzz: (progress?.currentJuzz || 1) + 1 })}
                className="py-3 px-4 bg-surface-container hover:bg-surface-container-high rounded border border-outline/10 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronUp size={16} />
                <span className="label-caps !text-[10px]">+1 Juzz</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex justify-between items-center mb-2">
              <span className="label-caps">Current Surah</span>
              <span className="font-serif italic text-primary">{progress?.currentSurah}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="label-caps">Last Synced</span>
              <span className="text-xs opacity-50">{progress?.lastUpdated ? new Date(progress.lastUpdated.seconds * 1000).toLocaleString() : 'Never'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ledger-card flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="label-caps">Overall Completion</span>
            <BookOpen className="text-secondary" size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-serif font-bold">{completionPercentage}%</span>
            <span className="text-sm text-on-surface-variant">{progress?.currentJuzz} Juzz progress</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
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
