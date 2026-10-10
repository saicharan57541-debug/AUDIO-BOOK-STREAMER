import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Audiobook, Chapter, ListeningProgress } from '../types';
import { ambientEngine } from '../utils/audioEngine';

interface AudioContextType {
  currentBook: Audiobook | null;
  currentChapter: Chapter | null;
  currentChapterIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  audioMode: 'stream' | 'spoken';
  ambientSound: 'none' | 'rain' | 'fireplace' | 'vinyl' | 'library';
  ambientVolume: number;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  isExpandedPlayerOpen: boolean;
  spokenHighlightIndex: number;

  playBook: (book: Audiobook, chapterIndex?: number, startTimestamp?: number) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  skip: (deltaSeconds: number) => void;
  selectChapter: (chapterIndex: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setAudioMode: (mode: 'stream' | 'spoken') => void;
  setAmbientSound: (ambient: 'none' | 'rain' | 'fireplace' | 'vinyl' | 'library') => void;
  setAmbientVolume: (vol: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  setIsExpandedPlayerOpen: (open: boolean) => void;
  userProgress: Record<string, ListeningProgress>;
  refreshProgress: () => Promise<void>;
  saveBookmark: (note?: string) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBook, setCurrentBook] = useState<Audiobook | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(300);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioMode, setAudioModeState] = useState<'stream' | 'spoken'>('stream');
  const [ambientSound, setAmbientSoundState] = useState<'none' | 'rain' | 'fireplace' | 'vinyl' | 'library'>('none');
  const [ambientVolume, setAmbientVolumeState] = useState<number>(0.25);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState<boolean>(false);
  const [spokenHighlightIndex, setSpokenHighlightIndex] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<Record<string, ListeningProgress>>({});

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioElementRef.current = audio;

    const onTimeUpdate = () => {
      if (audioMode === 'stream') {
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      // Auto advance to next chapter if available
      nextChapter();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [audioMode]);

  // Load user progress on mount
  const refreshProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/user/progress');
      if (res.ok) {
        const data = await res.json();
        setUserProgress(data.progress || {});
      }
    } catch (err) {
      console.warn('Failed to fetch progress:', err);
    }
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  // Save progress helper
  const syncProgressToServer = useCallback(
    async (bookId: string, chIndex: number, timeSec: number, totalDur: number) => {
      try {
        await fetch('/api/user/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId,
            chapterIndex: chIndex,
            timestampSeconds: Math.floor(timeSec),
            totalChapterDuration: Math.floor(totalDur)
          })
        });
        setUserProgress((prev) => ({
          ...prev,
          [bookId]: {
            bookId,
            chapterIndex: chIndex,
            timestampSeconds: Math.floor(timeSec),
            totalChapterDuration: Math.floor(totalDur),
            percentage: Math.min(100, Math.round((timeSec / totalDur) * 100)),
            lastUpdated: new Date().toISOString()
          }
        }));
      } catch (err) {
        console.warn('Failed to save progress to server:', err);
      }
    },
    []
  );

  // Periodic autosave progress while playing
  useEffect(() => {
    if (isPlaying && currentBook) {
      progressSaveTimerRef.current = setInterval(() => {
        syncProgressToServer(currentBook.id, currentChapterIndex, currentTime, duration);
      }, 5000);
    } else {
      if (progressSaveTimerRef.current) {
        clearInterval(progressSaveTimerRef.current);
      }
    }
    return () => {
      if (progressSaveTimerRef.current) clearInterval(progressSaveTimerRef.current);
    };
  }, [isPlaying, currentBook, currentChapterIndex, currentTime, duration, syncProgressToServer]);

  // Handle Ambient Sound updates
  useEffect(() => {
    if (isPlaying && ambientSound !== 'none') {
      ambientEngine.setAmbient(ambientSound, ambientVolume);
    } else {
      ambientEngine.stop();
    }
  }, [isPlaying, ambientSound, ambientVolume]);

  // Handle Sleep Timer countdown
  useEffect(() => {
    if (sleepTimerMinutes !== null && isPlaying) {
      let secondsLeft = sleepTimerRemaining ?? sleepTimerMinutes * 60;
      if (sleepTimerRemaining === null) {
        setSleepTimerRemaining(secondsLeft);
      }

      sleepTimerIntervalRef.current = setInterval(() => {
        secondsLeft -= 1;
        setSleepTimerRemaining(secondsLeft);
        if (secondsLeft <= 0) {
          pause();
          setSleepTimerMinutes(null);
          setSleepTimerRemaining(null);
          if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
        }
      }, 1000);
    } else {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    }

    return () => {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    };
  }, [sleepTimerMinutes, isPlaying]);

  const currentChapter = currentBook?.chapters.find((c) => c.chapterIndex === currentChapterIndex) || null;

  // Setup / Switch Chapter
  const setupChapterPlayback = useCallback(
    (book: Audiobook, chIndex: number, startAtSeconds: number = 0) => {
      const chapter = book.chapters.find((c) => c.chapterIndex === chIndex) || book.chapters[0];
      const actualChIndex = chapter.chapterIndex;
      setCurrentChapterIndex(actualChIndex);
      setDuration(chapter.durationSeconds);
      setCurrentTime(startAtSeconds);

      if (audioMode === 'stream') {
        const audio = audioElementRef.current;
        if (audio) {
          // Point to HTTP Range stream endpoint
          audio.src = `/api/audio/${book.id}/${actualChIndex}`;
          audio.playbackRate = playbackRate;
          audio.volume = isMuted ? 0 : volume;
          audio.currentTime = startAtSeconds;
          audio.play().then(() => setIsPlaying(true)).catch((e) => console.warn('Stream play error:', e));
        }
      } else {
        // Spoken Speech Synthesis
        startSpeechSynthesis(chapter.transcript, startAtSeconds, chapter.durationSeconds);
      }
    },
    [audioMode, playbackRate, isMuted, volume]
  );

  // Speech synthesis controller
  const startSpeechSynthesis = (text: string, startSec: number = 0, totalDur: number = 300) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.volume = isMuted ? 0 : volume;

      const words = text.split(/\s+/);
      const totalWords = words.length;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const progressRatio = Math.min(1, charIndex / text.length);
          const computedTime = progressRatio * totalDur;
          setCurrentTime(computedTime);
          setSpokenHighlightIndex(Math.min(totalWords - 1, Math.floor(progressRatio * totalWords)));
        }
      };

      utterance.onend = () => {
        nextChapter();
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const playBook = (book: Audiobook, chapterIndex?: number, startTimestamp?: number) => {
    setCurrentBook(book);
    const targetChapter = chapterIndex ?? userProgress[book.id]?.chapterIndex ?? 1;
    const targetTimestamp = startTimestamp ?? (chapterIndex === undefined ? userProgress[book.id]?.timestampSeconds ?? 0 : 0);
    setupChapterPlayback(book, targetChapter, targetTimestamp);
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioMode === 'stream') {
      audioElementRef.current?.pause();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    }
    if (currentBook) {
      syncProgressToServer(currentBook.id, currentChapterIndex, currentTime, duration);
    }
  };

  const resume = () => {
    if (!currentBook) return;
    setIsPlaying(true);
    if (audioMode === 'stream') {
      audioElementRef.current?.play().catch((e) => console.warn('Audio resume error:', e));
    } else {
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (currentChapter) {
          startSpeechSynthesis(currentChapter.transcript, currentTime, duration);
        }
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(duration, seconds));
    setCurrentTime(clamped);
    if (audioMode === 'stream') {
      if (audioElementRef.current) {
        audioElementRef.current.currentTime = clamped;
      }
    } else {
      if (currentChapter && isPlaying) {
        startSpeechSynthesis(currentChapter.transcript, clamped, duration);
      }
    }
    if (currentBook) {
      syncProgressToServer(currentBook.id, currentChapterIndex, clamped, duration);
    }
  };

  const skip = (deltaSeconds: number) => {
    seek(currentTime + deltaSeconds);
  };

  const selectChapter = (chapterIndex: number) => {
    if (!currentBook) return;
    setupChapterPlayback(currentBook, chapterIndex, 0);
  };

  const nextChapter = () => {
    if (!currentBook) return;
    const nextIdx = currentChapterIndex + 1;
    const exists = currentBook.chapters.some((c) => c.chapterIndex === nextIdx);
    if (exists) {
      setupChapterPlayback(currentBook, nextIdx, 0);
    } else {
      pause();
    }
  };

  const prevChapter = () => {
    if (!currentBook) return;
    if (currentTime > 5) {
      // Seek back to start of chapter
      seek(0);
    } else {
      const prevIdx = currentChapterIndex - 1;
      const exists = currentBook.chapters.some((c) => c.chapterIndex === prevIdx);
      if (exists) {
        setupChapterPlayback(currentBook, prevIdx, 0);
      } else {
        seek(0);
      }
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = rate;
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    if (audioElementRef.current) {
      audioElementRef.current.volume = clamped;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioElementRef.current) {
        audioElementRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  };

  const setAudioMode = (mode: 'stream' | 'spoken') => {
    setAudioModeState(mode);
    if (currentBook && currentChapter) {
      // Stop current mode and start new mode seamlessly
      if (mode === 'spoken') {
        audioElementRef.current?.pause();
        if (isPlaying) {
          startSpeechSynthesis(currentChapter.transcript, currentTime, duration);
        }
      } else {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        if (audioElementRef.current) {
          audioElementRef.current.src = `/api/audio/${currentBook.id}/${currentChapterIndex}`;
          audioElementRef.current.currentTime = currentTime;
          if (isPlaying) {
            audioElementRef.current.play().catch((e) => console.warn(e));
          }
        }
      }
    }
  };

  const setAmbientSound = (ambient: 'none' | 'rain' | 'fireplace' | 'vinyl' | 'library') => {
    setAmbientSoundState(ambient);
    if (isPlaying) {
      ambientEngine.setAmbient(ambient, ambientVolume);
    }
  };

  const setAmbientVolume = (vol: number) => {
    setAmbientVolumeState(vol);
    ambientEngine.setVolume(vol);
  };

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    setSleepTimerRemaining(minutes ? minutes * 60 : null);
  };

  const saveBookmark = async (note?: string) => {
    if (!currentBook) return;
    try {
      await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: currentBook.id,
          chapterIndex: currentChapterIndex,
          timestampSeconds: Math.floor(currentTime),
          note: note || `Bookmark at ${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}`
        })
      });
    } catch (err) {
      console.warn('Bookmark error:', err);
    }
  };

  return (
    <AudioContext.Provider
      value={{
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
        sleepTimerMinutes,
        sleepTimerRemaining,
        isExpandedPlayerOpen,
        spokenHighlightIndex,
        playBook,
        pause,
        resume,
        togglePlay,
        seek,
        skip,
        selectChapter,
        nextChapter,
        prevChapter,
        setPlaybackRate,
        setVolume,
        toggleMute,
        setAudioMode,
        setAmbientSound,
        setAmbientVolume,
        setSleepTimer,
        setIsExpandedPlayerOpen,
        userProgress,
        refreshProgress,
        saveBookmark
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
