import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { AUDIOBOOKS_DATA } from './server/data';
import { User, ListeningProgress, LibraryItem, Bookmark, UserStats } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent database structure with demo seed
interface DbSchema {
  users: Array<User & { passwordHash: string }>;
  tokens: Record<string, string>; // token -> userId
  progress: Record<string, Record<string, ListeningProgress>>; // userId -> bookId -> progress
  library: Record<string, LibraryItem[]>; // userId -> items
  bookmarks: Record<string, Bookmark[]>; // userId -> bookmarks
  stats: Record<string, UserStats>; // userId -> stats
}

const DB: DbSchema = {
  users: [
    {
      id: 'user_demo_1',
      name: 'Eleanor Hawthorne',
      email: 'eleanor@aurabooks.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      passwordHash: hashPassword('password123'),
    }
  ],
  tokens: {
    'token_demo_eleanor': 'user_demo_1'
  },
  progress: {
    'user_demo_1': {
      'gatsby': {
        bookId: 'gatsby',
        chapterIndex: 1,
        timestampSeconds: 142,
        totalChapterDuration: 310,
        percentage: 45,
        lastUpdated: new Date().toISOString()
      },
      'sherlock-holmes': {
        bookId: 'sherlock-holmes',
        chapterIndex: 2,
        timestampSeconds: 98,
        totalChapterDuration: 340,
        percentage: 28,
        lastUpdated: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    }
  },
  library: {
    'user_demo_1': [
      { bookId: 'gatsby', status: 'listening', addedAt: new Date().toISOString() },
      { bookId: 'sherlock-holmes', status: 'listening', addedAt: new Date().toISOString() },
      { bookId: 'pride-prejudice', status: 'favorite', addedAt: new Date().toISOString() },
      { bookId: 'art-of-war', status: 'saved', addedAt: new Date().toISOString() },
      { bookId: 'time-machine', status: 'completed', addedAt: new Date().toISOString() }
    ]
  },
  bookmarks: {
    'user_demo_1': [
      {
        id: 'bm_1',
        bookId: 'gatsby',
        chapterIndex: 1,
        timestampSeconds: 142,
        note: 'Famous advice on reserving all judgements.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bm_2',
        bookId: 'sherlock-holmes',
        chapterIndex: 2,
        timestampSeconds: 98,
        note: 'Holmes examining the visitor with Persian pipe.',
        createdAt: new Date().toISOString()
      }
    ]
  },
  stats: {
    'user_demo_1': {
      totalSecondsListened: 18450, // ~5.1 hours
      booksCompleted: 3,
      listeningStreakDays: 6
    }
  }
};

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_aurabooks_salt').digest('hex');
}

// Authentication helper
function getUserIdFromRequest(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (DB.tokens[token]) {
      return DB.tokens[token];
    }
  }
  // Default to demo user if no token provided so browsing & testing is seamless
  return 'user_demo_1';
}

// ==========================================
// 1. AUDIO STREAMING ENDPOINT (HTTP 206 Partial Content)
// ==========================================
// Generates PCM audio data buffers on the fly with HTTP range support
const audioBufferCache = new Map<string, Buffer>();

function generateWavBuffer(bookId: string, chapterIndex: number, durationSeconds: number): Buffer {
  const cacheKey = `${bookId}_${chapterIndex}`;
  if (audioBufferCache.has(cacheKey)) {
    return audioBufferCache.get(cacheKey)!;
  }

  const sampleRate = 22050; // Standard clear voice sample rate
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const headerSize = 44;
  const totalFileSize = headerSize + dataSize;

  const buffer = Buffer.alloc(totalFileSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(totalFileSize - 8, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate pleasant acoustic synthesizer chapter tone:
  // Base chord frequency tailored by chapter
  const baseFreq = 164.81 * (1 + (chapterIndex % 4) * 0.125); // E3 harmonic base
  let offset = headerSize;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Harmonic narration tone with soft ambient drone and gentle pulse
    const envelope = Math.min(1, Math.min(t / 0.5, (durationSeconds - t) / 0.5)); // smooth in/out
    const fundamental = Math.sin(2 * Math.PI * baseFreq * t);
    const harmonic1 = 0.5 * Math.sin(2 * Math.PI * (baseFreq * 1.5) * t); // Fifth
    const harmonic2 = 0.25 * Math.sin(2 * Math.PI * (baseFreq * 2) * t); // Octave
    
    // Slow breathing modulation (simulates rhythmic voice pace)
    const rhythm = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.4 * t);
    
    // Warm chime cadence every 12 seconds
    const chimeCadence = Math.exp(-((t % 12) * 2)) * Math.sin(2 * Math.PI * (baseFreq * 3) * t);

    const sample = (fundamental + harmonic1 + harmonic2 + chimeCadence * 0.4) * rhythm * envelope * 0.25;

    // Convert float [-1.0, 1.0] to 16-bit signed integer [-32768, 32767]
    const clampedSample = Math.max(-1, Math.min(1, sample));
    const intSample = Math.floor(clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7fff);

    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  audioBufferCache.set(cacheKey, buffer);
  return buffer;
}

// HTTP Range Audio Stream endpoint
app.get('/api/audio/:bookId/:chapterIndex', (req: Request, res: Response) => {
  const { bookId, chapterIndex } = req.params;
  const book = AUDIOBOOKS_DATA.find((b) => b.id === bookId);
  if (!book) {
    res.status(404).json({ error: 'Audiobook not found' });
    return;
  }

  const chIdx = parseInt(chapterIndex, 10);
  const chapter = book.chapters.find((c) => c.chapterIndex === chIdx) || book.chapters[0];
  const audioBuffer = generateWavBuffer(bookId, chIdx, chapter.durationSeconds);
  const totalSize = audioBuffer.length;

  const range = req.headers.range;

  if (range) {
    // Parse Range header e.g. "bytes=0-102400"
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 512 * 1024 - 1, totalSize - 1); // 512KB chunk

    if (start >= totalSize || start < 0) {
      res.status(416).set({
        'Content-Range': `bytes */${totalSize}`
      }).send('Requested Range Not Satisfiable');
      return;
    }

    const chunkSize = end - start + 1;
    const chunk = audioBuffer.subarray(start, end + 1);

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'audio/wav',
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(chunk);
  } else {
    // Standard full stream response
    res.writeHead(200, {
      'Content-Length': totalSize,
      'Accept-Ranges': 'bytes',
      'Content-Type': 'audio/wav',
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(audioBuffer);
  }
});

// ==========================================
// 2. AUDIOBOOK METADATA ENDPOINTS
// ==========================================
app.get('/api/audiobooks', (req: Request, res: Response) => {
  const { q, category, sort } = req.query;
  let results = [...AUDIOBOOKS_DATA];

  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter((b) => b.category.toLowerCase() === category.toLowerCase());
  }

  if (q && typeof q === 'string' && q.trim()) {
    const search = q.toLowerCase();
    results = results.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        b.narrator.toLowerCase().includes(search) ||
        b.description.toLowerCase().includes(search)
    );
  }

  if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'duration') {
    results.sort((a, b) => b.totalDurationSeconds - a.totalDurationSeconds);
  } else if (sort === 'popular') {
    results.sort((a, b) => b.ratingCount - a.ratingCount);
  } else {
    // Default: title alphabetical or release
    results.sort((a, b) => b.ratingCount - a.ratingCount);
  }

  res.json({ audiobooks: results });
});

app.get('/api/audiobooks/:id', (req: Request, res: Response) => {
  const book = AUDIOBOOKS_DATA.find((b) => b.id === req.params.id);
  if (!book) {
    res.status(404).json({ error: 'Audiobook not found' });
    return;
  }
  res.json({ audiobook: book });
});

// ==========================================
// 3. AUTHENTICATION ENDPOINTS
// ==========================================
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  const existing = DB.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'User with this email already exists' });
    return;
  }

  const newUser: User & { passwordHash: string } = {
    id: `user_${Date.now()}`,
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    passwordHash: hashPassword(password)
  };

  DB.users.push(newUser);
  const token = `token_${crypto.randomBytes(16).toString('hex')}`;
  DB.tokens[token] = newUser.id;
  DB.library[newUser.id] = [];
  DB.progress[newUser.id] = {};
  DB.bookmarks[newUser.id] = [];
  DB.stats[newUser.id] = { totalSecondsListened: 0, booksCompleted: 0, listeningStreakDays: 1 };

  const { passwordHash, ...userClean } = newUser;
  res.json({ user: userClean, token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = DB.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = `token_${crypto.randomBytes(16).toString('hex')}`;
  DB.tokens[token] = user.id;

  const { passwordHash, ...userClean } = user;
  res.json({ user: userClean, token });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const user = DB.users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { passwordHash, ...userClean } = user;
  res.json({ user: userClean });
});

// ==========================================
// 4. LISTENING PROGRESS & RESUME ENDPOINTS
// ==========================================
app.get('/api/user/progress', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const userProgress = DB.progress[userId] || {};
  res.json({ progress: userProgress });
});

app.post('/api/user/progress', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { bookId, chapterIndex, timestampSeconds, totalChapterDuration } = req.body;

  if (!bookId || chapterIndex === undefined || timestampSeconds === undefined) {
    res.status(400).json({ error: 'Missing required progress parameters' });
    return;
  }

  if (!DB.progress[userId]) {
    DB.progress[userId] = {};
  }

  const total = totalChapterDuration || 300;
  const percentage = Math.min(100, Math.round((timestampSeconds / total) * 100));

  const progressRecord: ListeningProgress = {
    bookId,
    chapterIndex: Number(chapterIndex),
    timestampSeconds: Number(timestampSeconds),
    totalChapterDuration: total,
    percentage,
    lastUpdated: new Date().toISOString()
  };

  DB.progress[userId][bookId] = progressRecord;

  // Also auto-add or update in library if not present
  if (!DB.library[userId]) {
    DB.library[userId] = [];
  }
  const existingLibraryItem = DB.library[userId].find((item) => item.bookId === bookId);
  if (!existingLibraryItem) {
    DB.library[userId].unshift({
      bookId,
      status: percentage >= 95 ? 'completed' : 'listening',
      addedAt: new Date().toISOString()
    });
  } else if (percentage >= 95 && existingLibraryItem.status !== 'completed') {
    existingLibraryItem.status = 'completed';
    if (DB.stats[userId]) {
      DB.stats[userId].booksCompleted += 1;
    }
  }

  // Update listening stats
  if (!DB.stats[userId]) {
    DB.stats[userId] = { totalSecondsListened: 0, booksCompleted: 0, listeningStreakDays: 1 };
  }
  DB.stats[userId].totalSecondsListened += 5; // incremental tracker

  res.json({ success: true, progress: progressRecord });
});

// ==========================================
// 5. USER LIBRARY & BOOKMARKS
// ==========================================
app.get('/api/user/library', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const items = DB.library[userId] || [];
  res.json({ library: items });
});

app.post('/api/user/library', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { bookId, status } = req.body;

  if (!bookId || !status) {
    res.status(400).json({ error: 'bookId and status are required' });
    return;
  }

  if (!DB.library[userId]) {
    DB.library[userId] = [];
  }

  const existingIdx = DB.library[userId].findIndex((item) => item.bookId === bookId);
  if (existingIdx >= 0) {
    DB.library[userId][existingIdx].status = status;
  } else {
    DB.library[userId].unshift({
      bookId,
      status,
      addedAt: new Date().toISOString()
    });
  }

  res.json({ success: true, library: DB.library[userId] });
});

app.delete('/api/user/library/:bookId', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { bookId } = req.params;

  if (DB.library[userId]) {
    DB.library[userId] = DB.library[userId].filter((item) => item.bookId !== bookId);
  }

  res.json({ success: true, library: DB.library[userId] || [] });
});

app.get('/api/user/bookmarks', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { bookId } = req.query;
  let items = DB.bookmarks[userId] || [];
  if (bookId && typeof bookId === 'string') {
    items = items.filter((b) => b.bookId === bookId);
  }
  res.json({ bookmarks: items });
});

app.post('/api/user/bookmarks', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { bookId, chapterIndex, timestampSeconds, note } = req.body;

  if (!bookId || chapterIndex === undefined || timestampSeconds === undefined) {
    res.status(400).json({ error: 'Missing bookmark parameters' });
    return;
  }

  if (!DB.bookmarks[userId]) {
    DB.bookmarks[userId] = [];
  }

  const newBookmark: Bookmark = {
    id: `bm_${Date.now()}`,
    bookId,
    chapterIndex: Number(chapterIndex),
    timestampSeconds: Number(timestampSeconds),
    note: note || `Bookmark at ${Math.floor(timestampSeconds / 60)}:${Math.floor(timestampSeconds % 60).toString().padStart(2, '0')}`,
    createdAt: new Date().toISOString()
  };

  DB.bookmarks[userId].unshift(newBookmark);
  res.json({ success: true, bookmark: newBookmark });
});

app.delete('/api/user/bookmarks/:id', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { id } = req.params;

  if (DB.bookmarks[userId]) {
    DB.bookmarks[userId] = DB.bookmarks[userId].filter((b) => b.id !== id);
  }

  res.json({ success: true });
});

app.get('/api/user/stats', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const stats = DB.stats[userId] || {
    totalSecondsListened: 0,
    booksCompleted: 0,
    listeningStreakDays: 1
  };
  res.json({ stats });
});

// ==========================================
// 6. DEV / PROD SERVER BOOTSTRAP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Audiobook Streamer server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
