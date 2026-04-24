export interface SurahInfo {
  id: number;
  name_arabic: string;
  name_simple: string;
  translated_name: {
    name: string;
  };
  verses_count: number;
  revelation_place: string;
  pages: number[];
}

export async function fetchSurahDetails(surahNameOrId: string | number): Promise<SurahInfo | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNameOrId}`);
    if (!response.ok) return null;
    const result = await response.json();
    const s = result.data;
    return {
      id: s.number,
      name_arabic: s.name,
      name_simple: s.englishName,
      translated_name: {
        name: s.englishNameTranslation
      },
      verses_count: s.numberOfAyahs,
      revelation_place: s.revelationType,
      pages: [] // Al Quran Cloud doesn't provide pages in this endpoint
    };
  } catch (error) {
    console.error("Error fetching Surah details from Al Quran Cloud:", error);
    return null;
  }
}

export async function fetchAllSurahs(): Promise<SurahInfo[]> {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    if (!response.ok) {
      // Fallback to internal/previous list if alquran.cloud is down
      return [];
    }
    const result = await response.json();
    return result.data.map((s: any) => ({
      id: s.number,
      name_arabic: s.name,
      name_simple: s.englishName,
      translated_name: {
        name: s.englishNameTranslation
      },
      verses_count: s.numberOfAyahs,
      revelation_place: s.revelationType,
      pages: []
    }));
  } catch (error) {
    console.error("Error fetching all Surahs from Al Quran Cloud:", error);
    return [];
  }
}

export function getAudioUrl(surahId: number, edition: string = 'ar.alafasy.hafs'): string {
  // Pattern verified from qurani.ai docs
  // Full surah audio is often available via this CDN pattern for surah-based editions
  return `https://quranhub.b-cdn.net/quran/audio/surah/${surahId}/${edition}/1.mp3`;
}

/**
 * Fetches the specific audio metadata for a surah to get the most accurate stream URL.
 */
export async function fetchSurahAudioUrl(surahId: number, edition: string = 'ar.alafasy.hafs'): Promise<string> {
  try {
    const response = await fetch(`https://api.qurani.ai/gw/qh/v1/surah/${surahId}/${edition}`);
    if (response.ok) {
      const result = await response.json();
      if (result.data && result.data.audio) {
        return result.data.audio;
      }
    }
    return getAudioUrl(surahId, edition);
  } catch (error) {
    return getAudioUrl(surahId, edition);
  }
}

export function getJuzs() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Juz ${i + 1}`
  }));
}
