const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || '';
const FOLDER_ID = '1XFm4z1Lllf8Q4HoCzhVvU1M6PxZQbeCI';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
}

export async function fetchAudioFiles(): Promise<DriveFile[]> {
  if (!API_KEY) {
    console.warn("GOOGLE_DRIVE_API_KEY is not set. Audio files will not be loaded.");
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,webViewLink,webContentLink)&key=${API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch files from Google Drive');
    }

    const data = await response.json();
    // Filter for audio files or all files if preferred
    return (data.files || []).filter((file: DriveFile) => 
      file.mimeType.startsWith('audio/') || 
      file.name.toLowerCase().endsWith('.mp3') || 
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.m4a')
    );
  } catch (error) {
    console.error("Error fetching audio from Drive:", error);
    return [];
  }
}

/**
 * Generates a direct streamable URL for a Google Drive file.
 * Requires the file to have public access "Anyone with the link can view".
 */
export function getAudioStreamUrl(fileId: string): string {
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;
}
