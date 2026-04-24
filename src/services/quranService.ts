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
    const chapters = await fetchAllSurahs();
    if (typeof surahNameOrId === 'number') {
      return chapters.find(c => c.id === surahNameOrId) || null;
    }

    const searchName = surahNameOrId.toLowerCase().replace(/[^a-z]/g, '');
    return chapters.find(c => 
      c.name_simple.toLowerCase().replace(/[^a-z]/g, '').includes(searchName) ||
      c.name_arabic.includes(surahNameOrId)
    ) || null;
  } catch (error) {
    console.error("Error fetching Quran data:", error);
    return null;
  }
}

export async function fetchAllSurahs(): Promise<SurahInfo[]> {
  try {
    // Using qurani.ai specialized endpoint for English data
    const response = await fetch('https://qurani.ai/api/chapters/en');
    if (!response.ok) {
      // Fallback to quran.com if qurani.ai specific path fails
      const fallbackResponse = await fetch('https://api.quran.com/api/v4/chapters');
      const data = await fallbackResponse.json();
      return data.chapters;
    }
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error("Error fetching all Surahs:", error);
    return [];
  }
}

export function getAudioUrl(surahId: number): string {
  // qurani.ai provides direct high-quality audio streams
  // Format: surahId padded to 3 digits
  const paddedId = surahId.toString().padStart(3, '0');
  return `https://qurani.ai/audio/recitation/en/${paddedId}.mp3`;
}

export function getJuzs() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Juz ${i + 1}`
  }));
}
