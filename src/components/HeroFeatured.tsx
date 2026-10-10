import React from 'react';
import { Audiobook } from '../types';
import { BookCover } from './BookCover';
import { Play, Pause, Bookmark, ListMusic, Star, Clock } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';

interface HeroFeaturedProps {
  featuredBook: Audiobook;
  onOpenDetail: (book: Audiobook) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ featuredBook, onOpenDetail }) => {
  const { currentBook, isPlaying, playBook, pause, resume, userProgress } = useAudio();
  const { library, toggleLibraryItem } = useAuth();

  const isCurrentActive = currentBook?.id === featuredBook.id;
  const progress = userProgress[featuredBook.id];
  const isInLibrary = library.some((item) => item.bookId === featuredBook.id);

  const handlePlayToggle = () => {
    if (isCurrentActive) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playBook(featuredBook);
    }
  };

  const minutesTotal = Math.round(featuredBook.totalDurationSeconds / 60);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 border border-stone-800 p-6 sm:p-8 md:p-10 mb-12 shadow-2xl">
      {/* Subtle ambient background glow based on book accent */}
      <div
        className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: featuredBook.coverGradient.accent }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Book Cover Showcase */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="transform hover:-translate-y-1 transition-transform duration-300 drop-shadow-2xl">
            <BookCover book={featuredBook} size="hero" showPlayingOverlay={isCurrentActive && isPlaying} />
          </div>
          {progress && (
            <div className="w-full mt-3 bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Book Narrative & Controls */}
        <div className="flex-1 text-center md:text-left">
          {/* Metadata line with typographic separators (anti-slop rule) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono text-stone-400 mb-3">
            <span className="text-amber-400 font-semibold tracking-wider uppercase">FEATURED AUDIOBOOK</span>
            <span aria-hidden="true">·</span>
            <span>{featuredBook.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">{featuredBook.rating}</span>
              <span className="text-stone-500">({featuredBook.ratingCount.toLocaleString()})</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="tabular-nums">{minutesTotal} mins</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight mb-3">
            {featuredBook.title}
          </h1>

          <p className="text-sm sm:text-base font-medium text-stone-300 mb-2">
            By <span className="text-stone-100">{featuredBook.author}</span>
            <span className="mx-2 text-stone-600">|</span>
            Narrated by <span className="text-amber-300/90">{featuredBook.narrator}</span>
          </p>

          <p className="text-stone-400 text-sm leading-relaxed max-w-2xl mb-6 line-clamp-3">
            {featuredBook.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handlePlayToggle}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-amber-950/50 hover:shadow-amber-500/20 cursor-pointer"
            >
              {isCurrentActive && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-stone-950" />
                  Pause Listening
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-stone-950" />
                  {progress && progress.percentage > 0 ? `Resume Ch. ${progress.chapterIndex} (${progress.percentage}%)` : 'Start Chapter 1'}
                </>
              )}
            </button>

            <button
              onClick={() => onOpenDetail(featuredBook)}
              className="px-4 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ListMusic className="w-4 h-4 text-stone-400" />
              Chapters & Transcript
            </button>

            <button
              onClick={() => toggleLibraryItem(featuredBook.id)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                isInLibrary
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-stone-800/80 border-stone-700/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
              title={isInLibrary ? 'Saved in Library' : 'Save to Library'}
            >
              <Bookmark className={`w-4 h-4 ${isInLibrary ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
