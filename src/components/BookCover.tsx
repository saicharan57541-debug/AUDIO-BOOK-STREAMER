import React from 'react';
import { Audiobook } from '../types';

interface BookCoverProps {
  book: Audiobook;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showPlayingOverlay?: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  className = '',
  showPlayingOverlay = false
}) => {
  const sizeClasses = {
    sm: 'w-12 h-16 text-[9px]',
    md: 'w-full aspect-[3/4] text-xs',
    lg: 'w-48 sm:w-56 aspect-[3/4] text-sm',
    hero: 'w-56 sm:w-64 aspect-[3/4] text-base'
  };

  const { from, via, to, accent, textColor } = book.coverGradient;

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 select-none transition-transform duration-300 group border border-stone-800/60 ${sizeClasses[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`
      }}
    >
      {/* Book spine lighting overlay (gives realistic 3D book fold appearance) */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/50 pointer-events-none" />

      {/* Decorative filigree border */}
      <div
        className="absolute inset-2 border pointer-events-none rounded opacity-40 transition-opacity duration-300 group-hover:opacity-75"
        style={{ borderColor: accent }}
      />

      {/* Top Header: Category / Genre */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="uppercase tracking-widest text-[9px] sm:text-[10px] font-medium font-mono"
          style={{ color: accent }}
        >
          {book.category}
        </span>
        <span className="text-[10px] opacity-70" style={{ color: textColor }}>
          {book.releaseYear > 0 ? book.releaseYear : `${Math.abs(book.releaseYear)} BC`}
        </span>
      </div>

      {/* Middle Center: Artistic Typography Title */}
      <div className="relative z-10 my-auto text-center px-1">
        <h3
          className="font-serif font-bold tracking-tight leading-tight drop-shadow-md line-clamp-3"
          style={{ color: textColor }}
        >
          {book.title}
        </h3>
        <div
          className="w-8 h-[1px] mx-auto my-2 opacity-60"
          style={{ backgroundColor: accent }}
        />
        <p className="text-[11px] sm:text-xs font-sans tracking-wide opacity-90 line-clamp-1" style={{ color: textColor }}>
          {book.author}
        </p>
      </div>

      {/* Bottom Footer: Narrator info */}
      <div className="relative z-10 flex items-center justify-between text-[10px] opacity-80 pt-1 border-t border-white/10">
        <span className="truncate max-w-[80%]" style={{ color: textColor }}>
          Voice: {book.narrator}
        </span>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      {/* Active playing indicator badge */}
      {showPlayingOverlay && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
          <div className="flex items-end gap-1 h-6">
            <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
            <span className="w-1 bg-amber-400 rounded-full animate-bounce h-6" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
            <span className="w-1 bg-amber-400 rounded-full animate-bounce h-5" style={{ animationDelay: '450ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};
