export interface ReadingLog {
  id: string;
  grade: number;
  classNum: number;
  studentName: string;
  bookTitle: string;
  author: string;
  publisher: string;
  summary: string;
  thoughts: string;
  rating: number; // 1 to 5
  createdAt: string; // ISO string or formatted date
  badge?: string; // Optional praise badge e.g. '다독왕 🏆', '생각으뜸 💡'
  teacherComment?: string; // Optional teacher comment
}

export interface GASConfig {
  webAppUrl: string;
  lastTestedAt?: string;
  isConnected?: boolean;
}

export interface StudentStats {
  studentName: string;
  grade: number;
  classNum: number;
  count: number;
  latestBook: string;
  avgRating: number;
}

export type ActiveTab = 'student' | 'king' | 'teacher' | 'settings';
