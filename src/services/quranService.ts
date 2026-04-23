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
    // We fetch all chapters and find the matching one to be robust against spelling differences
    const response = await fetch('https://api.quran.com/api/v4/chapters');
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    const chapters: SurahInfo[] = data.chapters;

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
