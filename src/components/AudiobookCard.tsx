import React from 'react';
import { Audiobook } from '../types';
import { BookCover } from './BookCover';
import { Play, Pause, Bookmark, Star, Clock } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';

interface AudiobookCardProps {
  book: Audiobook;
  onOpenDetail: (book: Audiobook) => void;
}

export const AudiobookCard: React.FC<AudiobookCardProps> = ({ book, onOpenDetail }) => {
  const { currentBook, isPlaying, playBook, pause, resume, userProgress } = useAudio();
  const { library, toggleLibraryItem } = useAuth();

  const isCurrentActive = currentBook?.id === book.id;
  const progress = userProgress[book.id];
  const isInLibrary = library.some((item) => item.bookId === book.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentActive) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playBook(book);
    }
  };

  const handleLibraryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLibraryItem(book.id);
  };

  const minutesTotal = Math.round(book.totalDurationSeconds / 60);

  return (
    <div
      onClick={() => onOpenDetail(book)}
      className="group relative flex flex-col bg-stone-900/40 hover:bg-stone-900/80 rounded-xl border border-stone-800/80 hover:border-stone-700/80 p-3.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Cover Image Container */}
      <div className="relative mb-3.5 overflow-hidden rounded-lg">
        <BookCover book={book} size="md" showPlayingOverlay={isCurrentActive && isPlaying} />

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title={isCurrentActive && isPlaying ? 'Pause' : 'Play Audiobook'}
          >
            {isCurrentActive && isPlaying ? (
              <Pause className="w-5 h-5 fill-stone-950" />
            ) : (
              <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
            )}
          </button>
        </div>

        {/* Quick bookmark button in top corner */}
        <button
          onClick={handleLibraryClick}
          className={`absolute top-2 right-2 p-1.5 rounded-md backdrop-blur-md transition-colors cursor-pointer ${
            isInLibrary
              ? 'bg-amber-500/80 text-stone-950'
              : 'bg-stone-900/70 text-stone-300 hover:bg-stone-900 hover:text-white'
          }`}
          title={isInLibrary ? 'Saved in library' : 'Save to library'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isInLibrary ? 'fill-stone-950' : ''}`} />
        </button>

        {/* Listening Progress Bar */}
        {progress && progress.percentage > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 h-1.5">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Clean Unboxed Metadata */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 mb-1">
        <span>{book.category}</span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1 text-amber-300/90">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="tabular-nums font-semibold">{book.rating}</span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-0.5 tabular-nums">
          <Clock className="w-3 h-3" />
          {minutesTotal}m
        </span>
      </div>

      {/* Book Title & Author */}
      <h3 className="font-serif font-bold text-stone-100 text-base leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
        {book.title}
      </h3>
      <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
        By {book.author}
      </p>

      {/* Narrator */}
      <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/60">
        <span className="truncate">Voice: {book.narrator}</span>
        {progress ? (
          <span className="text-amber-400/90 font-mono text-[10px] tabular-nums shrink-0">
            {progress.percentage}% listened
          </span>
        ) : (
          <span className="text-stone-400 font-mono text-[10px] shrink-0">
            {book.chapters.length} chs
          </span>
        )}
      </div>
    </div>
  );
};
