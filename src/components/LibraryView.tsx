import React, { useState } from 'react';
import { Audiobook } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { AudiobookCard } from './AudiobookCard';
import { BookCover } from './BookCover';
import { Play, Pause, Bookmark, Heart, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface LibraryViewProps {
  allBooks: Audiobook[];
  onOpenDetail: (book: Audiobook) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ allBooks, onOpenDetail }) => {
  const { user, library, bookmarks, removeFromLibrary } = useAuth();
  const { currentBook, isPlaying, playBook, pause, resume, userProgress } = useAudio();
  const [subTab, setSubTab] = useState<'listening' | 'saved' | 'favorite' | 'completed' | 'notes'>('listening');

  // Filter books in library
  const getBooksByStatus = (status: 'listening' | 'saved' | 'favorite' | 'completed') => {
    const ids = library.filter((item) => item.status === status).map((i) => i.bookId);
    return allBooks.filter((b) => ids.includes(b.id));
  };

  const listeningBooks = getBooksByStatus('listening');
  const savedBooks = getBooksByStatus('saved');
  const favoriteBooks = getBooksByStatus('favorite');
  const completedBooks = getBooksByStatus('completed');

  const displayedBooks =
    subTab === 'listening'
      ? listeningBooks
      : subTab === 'saved'
      ? savedBooks
      : subTab === 'favorite'
      ? favoriteBooks
      : completedBooks;

  return (
    <div className="space-y-8">
      {/* Header title & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
            Personal Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Track your reading progress, resume listening sessions, and review bookmarked moments.
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl text-xs">
          <button
            onClick={() => setSubTab('listening')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === 'listening'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            In Progress ({listeningBooks.length})
          </button>
          <button
            onClick={() => setSubTab('saved')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === 'saved'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Saved ({savedBooks.length})
          </button>
          <button
            onClick={() => setSubTab('favorite')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === 'favorite'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Favorites ({favoriteBooks.length})
          </button>
          <button
            onClick={() => setSubTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === 'completed'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Completed ({completedBooks.length})
          </button>
          <button
            onClick={() => setSubTab('notes')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === 'notes'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Main List Display */}
      {subTab === 'notes' ? (
        /* Bookmarks view */
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-stone-900/30 rounded-2xl border border-stone-800">
              <Bookmark className="w-10 h-10 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-300 font-medium">No bookmarks saved yet</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                While listening to any chapter, tap the bookmark icon to save quotes and audio timestamps.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((bm) => {
                const book = allBooks.find((b) => b.id === bm.bookId);
                if (!book) return null;
                const m = Math.floor(bm.timestampSeconds / 60);
                const s = Math.floor(bm.timestampSeconds % 60).toString().padStart(2, '0');

                return (
                  <div
                    key={bm.id}
                    className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl flex items-start gap-4 hover:border-stone-700 transition-colors"
                  >
                    <BookCover book={book} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-stone-200 truncate">{book.title}</h4>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">
                        Chapter {bm.chapterIndex} · {m}:{s}
                      </p>
                      <p className="text-xs text-stone-300 mt-2 bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
                        "{bm.note}"
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => playBook(book, bm.chapterIndex, bm.timestampSeconds)}
                          className="px-3 py-1 bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-stone-950" />
                          Jump to Audio
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Books grid */
        <div>
          {displayedBooks.length === 0 ? (
            <div className="text-center py-16 bg-stone-900/30 rounded-2xl border border-stone-800">
              <p className="text-stone-300 font-medium">No audiobooks in this shelf</p>
              <p className="text-xs text-stone-500 mt-1">
                Browse our catalog to discover and stream audiobooks.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {displayedBooks.map((book) => {
                const prog = userProgress[book.id];
                return (
                  <div key={book.id} className="relative group">
                    <AudiobookCard book={book} onOpenDetail={onOpenDetail} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromLibrary(book.id);
                      }}
                      className="absolute top-2 left-2 p-1.5 rounded-md bg-stone-950/80 text-stone-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                      title="Remove from Shelf"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
