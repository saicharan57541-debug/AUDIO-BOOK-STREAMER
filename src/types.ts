export interface Chapter {
  id: string;
  chapterIndex: number;
  title: string;
  durationSeconds: number; // e.g. 180 (3 min) for preview/demo streaming
  transcript: string;
}

export interface Audiobook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  category: 'Classics' | 'Mystery' | 'Sci-Fi' | 'Philosophy' | 'Adventure' | 'Horror';
  rating: number;
  ratingCount: number;
  totalDurationSeconds: number;
  description: string;
  releaseYear: number;
  coverGradient: {
    from: string;
    via: string;
    to: string;
    accent: string;
    textColor: string;
  };
  chapters: Chapter[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ListeningProgress {
  bookId: string;
  chapterIndex: number;
  timestampSeconds: number;
  totalChapterDuration: number;
  percentage: number;
  lastUpdated: string;
}

export interface LibraryItem {
  bookId: string;
  status: 'listening' | 'saved' | 'favorite' | 'completed';
  addedAt: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  timestampSeconds: number;
  note: string;
  createdAt: string;
}

export interface UserStats {
  totalSecondsListened: number;
  booksCompleted: number;
  listeningStreakDays: number;
}
