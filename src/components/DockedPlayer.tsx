import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { BookCover } from './BookCover';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Moon,
  Sparkles,
  CloudRain,
  Flame,
  Disc3,
  BookmarkPlus
} from 'lucide-react';

export const DockedPlayer: React.FC = () => {
  const {
    currentBook,
    currentChapter,
    currentChapterIndex,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    audioMode,
    ambientSound,
    sleepTimerRemaining,
    togglePlay,
    seek,
    skip,
    nextChapter,
    prevChapter,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setAudioMode,
    setAmbientSound,
    setSleepTimer,
    setIsExpandedPlayerOpen,
    saveBookmark
  } = useAudio();

  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isSleepMenuOpen, setIsSleepMenuOpen] = useState(false);
  const [isAmbientMenuOpen, setIsAmbientMenuOpen] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);

  if (!currentBook) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleSaveBookmark = async () => {
    await saveBookmark();
    setShowBookmarkToast(true);
    setTimeout(() => setShowBookmarkToast(false), 2000);
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const sleepTimerOptions = [
    { label: 'Off', value: null },
    { label: '5 min', value: 5 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 }
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] text-stone-100">
      {/* Mini Scrubber Track across very top of bar */}
      <div className="relative w-full h-1 group cursor-pointer bg-stone-800/80">
        <div
          className="absolute left-0 top-0 bottom-0 bg-amber-400 group-hover:bg-amber-300 transition-all duration-75"
          style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
        />
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.5"
          value={currentTime}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-label="Audio scrubber"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        
        {/* Left Zone: Audiobook details */}
        <div className="flex items-center gap-3 min-w-0 max-w-[28%] sm:max-w-[30%]">
          <button
            onClick={() => setIsExpandedPlayerOpen(true)}
            className="shrink-0 cursor-pointer hover:scale-105 transition-transform"
          >
            <BookCover book={currentBook} size="sm" showPlayingOverlay={isPlaying} />
          </button>
          <div className="min-w-0">
            <h4
              onClick={() => setIsExpandedPlayerOpen(true)}
              className="font-serif font-bold text-xs sm:text-sm text-stone-100 truncate hover:text-amber-400 cursor-pointer transition-colors"
            >
              {currentBook.title}
            </h4>
            <p className="text-[11px] text-stone-400 truncate">
              {currentChapter ? currentChapter.title : `Chapter ${currentChapterIndex}`}
            </p>
            <p className="text-[10px] text-stone-500 truncate hidden sm:block">
              Voice: {currentBook.narrator}
            </p>
          </div>
        </div>

        {/* Center Zone: Core Audio Controls */}
        <div className="flex flex-col items-center flex-1 max-w-lg">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={prevChapter}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Previous Chapter"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => skip(-15)}
              className="text-stone-400 hover:text-white transition-colors flex items-center gap-0.5 text-[10px] font-mono cursor-pointer"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">15s</span>
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-stone-950" />
              ) : (
                <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => skip(15)}
              className="text-stone-400 hover:text-white transition-colors flex items-center gap-0.5 text-[10px] font-mono cursor-pointer"
              title="Forward 15 seconds"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">15s</span>
            </button>

            <button
              onClick={nextChapter}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Next Chapter"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Time display & seek slider */}
          <div className="w-full flex items-center gap-2 mt-1 px-2">
            <span className="text-[10px] font-mono text-stone-400 tabular-nums w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={handleSeekChange}
              className="flex-1 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-mono text-stone-400 tabular-nums w-8">
              -{formatTime(Math.max(0, duration - currentTime))}
            </span>
          </div>
        </div>

        {/* Right Zone: Secondary features & Volume */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Bookmark button */}
          <div className="relative">
            <button
              onClick={handleSaveBookmark}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-900 transition-colors cursor-pointer"
              title="Bookmark Current Timestamp"
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
            {showBookmarkToast && (
              <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-amber-400 text-stone-950 text-[10px] font-semibold rounded shadow-lg whitespace-nowrap">
                Bookmark saved!
              </div>
            )}
          </div>

          {/* Ambient Sound Mixer Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setIsAmbientMenuOpen(!isAmbientMenuOpen);
                setIsSpeedMenuOpen(false);
                setIsSleepMenuOpen(false);
              }}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                ambientSound !== 'none'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title="Ambient Atmosphere Mixer"
            >
              {ambientSound === 'rain' && <CloudRain className="w-3.5 h-3.5 text-blue-400" />}
              {ambientSound === 'fireplace' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
              {ambientSound === 'vinyl' && <Disc3 className="w-3.5 h-3.5 text-amber-400" />}
              {ambientSound === 'none' && <Sparkles className="w-3.5 h-3.5" />}
              <span className="capitalize">{ambientSound === 'none' ? 'Atmosphere' : ambientSound}</span>
            </button>

            {isAmbientMenuOpen && (
              <div
                className="absolute bottom-full right-0 mb-2 w-44 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-1.5 text-xs z-50"
                onMouseLeave={() => setIsAmbientMenuOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] text-stone-500 font-mono uppercase tracking-wider">
                  Ambient Soundscape
                </div>
                {(['none', 'rain', 'fireplace', 'vinyl', 'library'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setAmbientSound(type);
                      setIsAmbientMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize flex items-center justify-between cursor-pointer ${
                      ambientSound === type
                        ? 'bg-amber-400/10 text-amber-400 font-semibold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span>{type === 'none' ? 'None (Pure Voice)' : type}</span>
                    {ambientSound === type && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Speed Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSpeedMenuOpen(!isSpeedMenuOpen);
                setIsSleepMenuOpen(false);
                setIsAmbientMenuOpen(false);
              }}
              className="px-2 py-1 rounded-md bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-mono tabular-nums transition-colors cursor-pointer"
            >
              {playbackRate}x
            </button>

            {isSpeedMenuOpen && (
              <div
                className="absolute bottom-full right-0 mb-2 w-28 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-1 text-xs z-50 font-mono"
                onMouseLeave={() => setIsSpeedMenuOpen(false)}
              >
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setIsSpeedMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-amber-400/10 text-amber-400 font-semibold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {rate}x Speed
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Timer */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setIsSleepMenuOpen(!isSleepMenuOpen);
                setIsSpeedMenuOpen(false);
                setIsAmbientMenuOpen(false);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                sleepTimerRemaining !== null
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
              title="Sleep Timer"
            >
              <Moon className="w-4 h-4" />
              {sleepTimerRemaining !== null && (
                <span className="text-[10px] font-mono tabular-nums">
                  {Math.ceil(sleepTimerRemaining / 60)}m
                </span>
              )}
            </button>

            {isSleepMenuOpen && (
              <div
                className="absolute bottom-full right-0 mb-2 w-32 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-1 text-xs z-50 font-mono"
                onMouseLeave={() => setIsSleepMenuOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] text-stone-500 uppercase">Sleep Timer</div>
                {sleepTimerOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSleepTimer(opt.value);
                      setIsSleepMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-stone-300 hover:bg-stone-800 cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 bg-stone-800 rounded appearance-none cursor-pointer"
              aria-label="Volume slider"
            />
          </div>

          {/* Fullscreen / Theater expand */}
          <button
            onClick={() => setIsExpandedPlayerOpen(true)}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-900 rounded-lg transition-colors cursor-pointer"
            title="Expand Theater Player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
