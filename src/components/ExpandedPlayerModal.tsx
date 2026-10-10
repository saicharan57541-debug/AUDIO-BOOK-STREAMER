import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { BookCover } from './BookCover';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Moon,
  Sparkles,
  CloudRain,
  Flame,
  Disc3,
  BookmarkPlus,
  BookOpen,
  ListMusic,
  Sliders,
  Check
} from 'lucide-react';

export const ExpandedPlayerModal: React.FC = () => {
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
    ambientVolume,
    sleepTimerRemaining,
    isExpandedPlayerOpen,
    spokenHighlightIndex,
    togglePlay,
    seek,
    skip,
    nextChapter,
    prevChapter,
    selectChapter,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setAudioMode,
    setAmbientSound,
    setAmbientVolume,
    setSleepTimer,
    setIsExpandedPlayerOpen,
    saveBookmark
  } = useAudio();

  const [activeSideTab, setActiveSideTab] = useState<'chapters' | 'transcript' | 'ambience'>('chapters');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isExpandedPlayerOpen || !currentBook) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleSaveBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBookmark(bookmarkNote.trim() || undefined);
    setBookmarkNote('');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const words = currentChapter ? currentChapter.transcript.split(/\s+/) : [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/98 backdrop-blur-2xl flex flex-col text-stone-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b border-stone-800/80 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
            NOW PLAYING · {currentBook.category}
          </span>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg text-xs">
          <button
            onClick={() => setAudioMode('stream')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              audioMode === 'stream'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            HTTP Audio Stream
          </button>
          <button
            onClick={() => setAudioMode('spoken')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              audioMode === 'spoken'
                ? 'bg-amber-400 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Voice Narrator & Transcript
          </button>
        </div>

        <button
          onClick={() => setIsExpandedPlayerOpen(false)}
          className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
          aria-label="Close Expanded Player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Dual-Column Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 max-w-7xl mx-auto w-full items-center">
        
        {/* Left Column: Book Artwork & Big Audio Console */}
        <div className="lg:col-span-6 flex flex-col items-center text-center">
          {/* Book Cover with radiant backdrop glow */}
          <div className="relative mb-8 group">
            <div
              className="absolute -inset-4 rounded-2xl blur-2xl opacity-40 transition-opacity group-hover:opacity-60"
              style={{ backgroundColor: currentBook.coverGradient.accent }}
            />
            <div className="relative transform hover:scale-[1.02] transition-transform duration-300">
              <BookCover book={currentBook} size="hero" showPlayingOverlay={isPlaying} />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
            {currentBook.title}
          </h2>
          <p className="text-sm font-medium text-stone-400 mt-1">
            {currentChapter?.title || `Chapter ${currentChapterIndex}`}
          </p>
          <p className="text-xs text-amber-400/90 font-mono mt-0.5">
            Narrated by {currentBook.narrator} · Author: {currentBook.author}
          </p>

          {/* Scrubber Slider */}
          <div className="w-full max-w-md mt-6">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-stone-400 mt-1.5 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={prevChapter}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Previous Chapter"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => skip(-15)}
              className="p-3 text-stone-300 hover:text-white transition-colors cursor-pointer flex flex-col items-center"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-6 h-6" />
              <span className="text-[10px] font-mono mt-0.5">15s</span>
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-950/60 transition-transform hover:scale-105 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-stone-950" />
              ) : (
                <Play className="w-7 h-7 fill-stone-950 ml-1" />
              )}
            </button>

            <button
              onClick={() => skip(15)}
              className="p-3 text-stone-300 hover:text-white transition-colors cursor-pointer flex flex-col items-center"
              title="Forward 15 seconds"
            >
              <RotateCw className="w-6 h-6" />
              <span className="text-[10px] font-mono mt-0.5">15s</span>
            </button>

            <button
              onClick={nextChapter}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Next Chapter"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Secondary Controls Bar: Speed, Volume, Timer */}
          <div className="flex items-center gap-6 mt-6 text-xs text-stone-400 font-mono">
            {/* Speed Buttons */}
            <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-1">
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'hover:text-stone-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Sleep Timer */}
            <div className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-amber-400" />
              <select
                value={sleepTimerRemaining ? Math.ceil(sleepTimerRemaining / 60) : ''}
                onChange={(e) => setSleepTimer(e.target.value ? Number(e.target.value) : null)}
                className="bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-300"
              >
                <option value="">Timer: Off</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Chapters Drawer, Live Transcript & Atmosphere Studio */}
        <div className="lg:col-span-6 bg-stone-900/60 border border-stone-800 rounded-2xl h-[460px] flex flex-col overflow-hidden">
          {/* Sub-Tabs Header */}
          <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2.5 bg-stone-950/40 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveSideTab('chapters')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'chapters'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                Chapters ({currentBook.chapters.length})
              </button>
              <button
                onClick={() => setActiveSideTab('transcript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'transcript'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Live Transcript
              </button>
              <button
                onClick={() => setActiveSideTab('ambience')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'ambience'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Atmosphere Mixer
              </button>
            </div>
          </div>

          {/* Side Tab Body */}
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* Chapters Tab */}
            {activeSideTab === 'chapters' && (
              <div className="space-y-2">
                {currentBook.chapters.map((ch) => {
                  const isCurrent = ch.chapterIndex === currentChapterIndex;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => selectChapter(ch.chapterIndex)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                            isCurrent
                              ? 'bg-amber-400 text-stone-950 font-bold'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {ch.chapterIndex}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{ch.title}</p>
                          <p className="text-[11px] text-stone-500 line-clamp-1">{ch.transcript}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-stone-400 tabular-nums shrink-0">
                        {Math.round(ch.durationSeconds / 60)}m
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Live Transcript Tab */}
            {activeSideTab === 'transcript' && (
              <div className="space-y-4">
                <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 text-stone-200 font-serif leading-relaxed text-sm sm:text-base">
                  {audioMode === 'spoken' ? (
                    <p className="space-x-1">
                      {words.map((word, idx) => (
                        <span
                          key={idx}
                          className={`transition-colors duration-150 ${
                            idx === spokenHighlightIndex
                              ? 'bg-amber-400 text-stone-950 font-bold px-1 rounded'
                              : idx < spokenHighlightIndex
                              ? 'text-stone-400'
                              : 'text-stone-200'
                          }`}
                        >
                          {word}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p>{currentChapter?.transcript}</p>
                  )}
                </div>

                {/* Bookmark current note form */}
                <form onSubmit={handleSaveBookmark} className="flex gap-2">
                  <input
                    type="text"
                    value={bookmarkNote}
                    onChange={(e) => setBookmarkNote(e.target.value)}
                    placeholder="Annotate passage at current audio timestamp..."
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 text-stone-950 font-semibold rounded-lg text-xs hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Save Note
                  </button>
                </form>
                {showSavedToast && (
                  <p className="text-xs text-amber-400 font-mono text-center">
                    ✓ Bookmark note captured at {formatTime(currentTime)}
                  </p>
                )}
              </div>
            )}

            {/* Atmosphere Studio Tab */}
            {activeSideTab === 'ambience' && (
              <div className="space-y-6 p-2">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3">
                    Procedural Background Soundscapes
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'none', label: 'Pure Voice', icon: Sparkles },
                      { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
                      { id: 'fireplace', label: 'Cozy Fireplace', icon: Flame },
                      { id: 'vinyl', label: 'Warm Vinyl Hiss', icon: Disc3 },
                      { id: 'library', label: 'Quiet Library', icon: BookOpen }
                    ].map((amb) => {
                      const Icon = amb.icon;
                      const isSel = ambientSound === amb.id;
                      return (
                        <button
                          key={amb.id}
                          onClick={() => setAmbientSound(amb.id as any)}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSel
                              ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-semibold'
                              : 'bg-stone-950/40 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-xs">{amb.label}</span>
                          {isSel && <Check className="w-3.5 h-3.5 ml-auto text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {ambientSound !== 'none' && (
                  <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex justify-between text-xs font-mono text-stone-400">
                      <span>Soundscape Volume</span>
                      <span>{Math.round(ambientVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-800 rounded appearance-none cursor-pointer"
                    />
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
