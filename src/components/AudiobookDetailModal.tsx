import React, { useState } from 'react';
import { Audiobook, Chapter } from '../types';
import { BookCover } from './BookCover';
import {
  X,
  Play,
  Pause,
  Bookmark,
  Star,
  Clock,
  BookOpen,
  Volume2,
  Calendar,
  CheckCircle2,
  Heart,
  Plus
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';

interface AudiobookDetailModalProps {
  book: Audiobook | null;
  onClose: () => void;
}

export const AudiobookDetailModal: React.FC<AudiobookDetailModalProps> = ({ book, onClose }) => {
  const { currentBook, currentChapterIndex, isPlaying, playBook, pause, resume, selectChapter, saveBookmark, userProgress } = useAudio();
  const { library, bookmarks, toggleLibraryItem } = useAuth();
  const [activeTab, setActiveTab] = useState<'chapters' | 'transcript' | 'bookmarks'>('chapters');
  const [selectedChapterForTranscript, setSelectedChapterForTranscript] = useState<number>(1);
  const [newNoteText, setNewNoteText] = useState('');

  if (!book) return null;

  const isCurrentBook = currentBook?.id === book.id;
  const currentProgress = userProgress[book.id];
  const libraryItem = library.find((i) => i.bookId === book.id);
  const bookBookmarks = bookmarks.filter((b) => b.bookId === book.id);

  const handlePlayChapter = (chapterIndex: number) => {
    if (isCurrentBook && currentChapterIndex === chapterIndex) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playBook(book, chapterIndex, 0);
    }
  };

  const handleAddBookmarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      await saveBookmark(newNoteText.trim());
      setNewNoteText('');
    }
  };

  const minutesTotal = Math.round(book.totalDurationSeconds / 60);
  const activeChapterData = book.chapters.find((c) => c.chapterIndex === selectedChapterForTranscript) || book.chapters[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span className="text-amber-400 font-semibold">{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>{book.releaseYear > 0 ? book.releaseYear : `${Math.abs(book.releaseYear)} BC`}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-8">
          {/* Top Overview Split */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div className="shrink-0 mx-auto sm:mx-0">
              <BookCover book={book} size="lg" showPlayingOverlay={isCurrentBook && isPlaying} />
              
              {/* Library Action Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleLibraryItem(book.id, 'favorite')}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    libraryItem?.status === 'favorite'
                      ? 'bg-red-500/10 border-red-500/40 text-red-400'
                      : 'border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${libraryItem?.status === 'favorite' ? 'fill-red-400' : ''}`} />
                  {libraryItem?.status === 'favorite' ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button
                  onClick={() => toggleLibraryItem(book.id, 'saved')}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    libraryItem?.status === 'saved'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${libraryItem?.status === 'saved' ? 'fill-amber-400' : ''}`} />
                  {libraryItem?.status === 'saved' ? 'Saved to Library' : 'Bookmark Title'}
                </button>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 leading-tight">
                {book.title}
              </h2>
              <p className="text-stone-300 text-sm font-medium mt-1">
                By <span className="text-stone-100 font-semibold">{book.author}</span>
              </p>

              {/* Metadata Badges / Info */}
              <div className="flex flex-wrap items-center gap-3 my-3 text-xs text-stone-400 font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <strong className="tabular-nums">{book.rating}</strong>
                  <span>({book.ratingCount.toLocaleString()} ratings)</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span className="tabular-nums">{minutesTotal} mins total</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Narrated by {book.narrator}</span>
                </span>
              </div>

              {/* Description */}
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                {book.description}
              </p>

              {/* Big Play CTA */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const ch = currentProgress?.chapterIndex || 1;
                    const sec = currentProgress?.timestampSeconds || 0;
                    playBook(book, ch, sec);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  {isCurrentBook && isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-stone-950" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-stone-950" />
                      {currentProgress && currentProgress.percentage > 0
                        ? `Resume Ch. ${currentProgress.chapterIndex} (${currentProgress.percentage}%)`
                        : 'Play from Beginning'}
                    </>
                  )}
                </button>

                {currentProgress && (
                  <span className="text-xs text-stone-400 font-mono">
                    Progress: {currentProgress.percentage}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation: Chapters | Read-Along Transcript | Bookmarks */}
          <div>
            <div className="flex items-center gap-1 border-b border-stone-800 pb-2 mb-4">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'chapters'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Chapters ({book.chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'transcript'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Read-Along Transcript
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'bookmarks'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Bookmarks & Notes ({bookBookmarks.length})
              </button>
            </div>

            {/* Chapters Tab */}
            {activeTab === 'chapters' && (
              <div className="space-y-2">
                {book.chapters.map((ch) => {
                  const isCurrentChapter = isCurrentBook && currentChapterIndex === ch.chapterIndex;
                  const durationMins = Math.round(ch.durationSeconds / 60);

                  return (
                    <div
                      key={ch.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                        isCurrentChapter
                          ? 'bg-amber-500/10 border-amber-500/40 text-stone-100'
                          : 'bg-stone-900/40 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePlayChapter(ch.chapterIndex)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                            isCurrentChapter && isPlaying
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-950'
                          }`}
                        >
                          {isCurrentChapter && isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <div>
                          <p className="text-sm font-medium">{ch.title}</p>
                          <p className="text-xs text-stone-400 line-clamp-1">{ch.transcript}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-400 font-mono shrink-0 ml-4">
                        <span className="tabular-nums">{durationMins} min</span>
                        <button
                          onClick={() => {
                            setSelectedChapterForTranscript(ch.chapterIndex);
                            setActiveTab('transcript');
                          }}
                          className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-stone-300 cursor-pointer"
                        >
                          Read
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Transcript Tab */}
            {activeTab === 'transcript' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Viewing:</span>
                    <select
                      value={selectedChapterForTranscript}
                      onChange={(e) => setSelectedChapterForTranscript(Number(e.target.value))}
                      className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-stone-200"
                    >
                      {book.chapters.map((c) => (
                        <option key={c.chapterIndex} value={c.chapterIndex}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handlePlayChapter(selectedChapterForTranscript)}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    Play Chapter
                  </button>
                </div>

                <div className="bg-stone-950/60 p-5 rounded-xl border border-stone-800 leading-relaxed font-serif text-stone-200 text-base sm:text-lg">
                  {activeChapterData.transcript}
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-4">
                {/* Add new bookmark form */}
                <form onSubmit={handleAddBookmarkSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add a thought or bookmark note for this audiobook..."
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Note
                  </button>
                </form>

                {bookBookmarks.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-6">
                    No bookmarks saved yet. Save memorable passages or audio moments while listening!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {bookBookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs text-stone-200 font-medium">{bm.note}</p>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                            Chapter {bm.chapterIndex} · at {Math.floor(bm.timestampSeconds / 60)}:
                            {Math.floor(bm.timestampSeconds % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <button
                          onClick={() => playBook(book, bm.chapterIndex, bm.timestampSeconds)}
                          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded text-xs font-mono cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-amber-400" />
                          Jump
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
