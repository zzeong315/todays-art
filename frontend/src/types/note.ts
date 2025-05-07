export interface NoteTypes {
  content: string;
}

export interface ArtworkType {
  id: number;
  date: string; // ISO 형식의 날짜 문자열
  artworkId: number;
  title: string;
  imageUrl: string;
  artist: string;
  createdAt: string;
}

export interface AllNotesTypes {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  artworkId: number;
  artwork: ArtworkType;
}
