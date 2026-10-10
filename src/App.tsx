import React, { useState, useEffect } from 'react';
import { Audiobook } from './types';
import { AudioProvider, useAudio } from './context/AudioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { AudiobookCard } from './components/AudiobookCard';
import { AudiobookDetailModal } from './components/AudiobookDetailModal';
import { DockedPlayer } from './components/DockedPlayer';
import { ExpandedPlayerModal } from './components/ExpandedPlayerModal';
import { LibraryView } from './components/LibraryView';
import { StatsView } from './components/StatsView';
import { AuthModal } from './components/AuthModal';
import {
  Search,
  Filter,
  ArrowUpDown,
  Radio,
  BookOpen,
  Sparkles,
  Headphones,
  Sliders,
  CheckCircle,
  Play
} from 'lucide-react';

const AudiobookAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'discover' | 'browse' | 'library' | 'stats'>('discover');
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'duration'>('popular');
  const [selectedDetailBook, setSelectedDetailBook] = useState<Audiobook | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { userProgress, currentBook, isPlaying, playBook } = useAudio();

  // Fetch audiobooks from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery) {
          queryParams.append('q', searchQuery);
        }
        if (sortBy) {
          queryParams.append('sort', sortBy);
        }

        const res = await fetch(`/api/audiobooks?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setAudiobooks(data.audiobooks || []);
        }
      } catch (err) {
        console.warn('Error fetching audiobooks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory, searchQuery, sortBy]);

  const categories = ['All', 'Classics', 'Mystery', 'Sci-Fi', 'Philosophy', 'Adventure', 'Horror'];
  const featuredBook = audiobooks[0] || null;

  // In-progress audiobooks for quick resume carousel
  const inProgressBooks = audiobooks.filter((b) => userProgress[b.id] && userProgress[b.id].percentage > 0 && userProgress[b.id].percentage < 100);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 pb-28">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        
        {/* ========================================================= */}
        {/* TAB 1: DISCOVER                                           */}
        {/* ========================================================= */}
        {currentTab === 'discover' && (
          <div className="space-y-10">
            {/* Hero Featured Masterpiece */}
            {featuredBook && (
              <HeroFeatured
                featuredBook={featuredBook}
                onOpenDetail={(b) => setSelectedDetailBook(b)}
              />
            )}

            {/* Jump Back In (Resume Session) Strip if available */}
            {inProgressBooks.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <h2 className="text-lg font-serif font-bold text-stone-100">
                      Continue Listening
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('library')}
                    className="text-xs text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    View All in Library →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressBooks.map((b) => {
                    const prog = userProgress[b.id];
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedDetailBook(b)}
                        className="p-3.5 bg-stone-900/50 hover:bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between gap-3 group transition-all cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-amber-400/90 truncate">
                            Chapter {prog.chapterIndex} · {prog.percentage}% Complete
                          </p>
                          <h4 className="text-sm font-serif font-bold text-stone-100 truncate group-hover:text-amber-300 transition-colors">
                            {b.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 truncate">By {b.author}</p>
                          <div className="w-full bg-stone-800 h-1 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full"
                              style={{ width: `${prog.percentage}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playBook(b, prog.chapterIndex, prog.timestampSeconds);
                          }}
                          className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer shadow-md"
                          title="Resume Listening"
                        >
                          <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Curated Collection Section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                    Trending Literature & Masterpieces
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Stream high-fidelity narrated titles across public domain and world classics.
                  </p>
                </div>

                {/* Category tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-stone-800/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentTab('browse')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium ml-2 whitespace-nowrap cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {audiobooks.slice(0, 8).map((book) => (
                  <AudiobookCard
                    key={book.id}
                    book={book}
                    onOpenDetail={(b) => setSelectedDetailBook(b)}
                  />
                ))}
              </div>
            </section>

            {/* Core Streaming Architecture Feature Highlights */}
            <section className="mt-16 pt-12 border-t border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-3">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-200">
                  Instant HTTP 206 Streaming
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Stream chapters dynamically with byte-range requests. No heavy complete downloads required; seek instantly to any second with low latency.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 mb-3">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-200">
                  Procedural Soundscapes
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Layer soothing rain, crackling fireplace, quiet library acoustics, or vintage vinyl crackle under your narrator for total immersion.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-200">
                  Synchronized Read-Along
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Follow along with live chapter text highlighting, save memorable audio timestamp bookmarks, and continue seamlessly across devices.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BROWSE CATALOG                                     */}
        {/* ========================================================= */}
        {currentTab === 'browse' && (
          <div className="space-y-6">
            <div className="border-b border-stone-800 pb-5">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                Browse & Search Audiobooks
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Filter by genre, search by author or narrator, and discover your next great listen.
              </p>
            </div>

            {/* Filter & Search Bar Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, authors, narrators..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sort By selector */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="text-xs font-mono text-stone-500">
              Showing {audiobooks.length} audiobook{audiobooks.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            </div>

            {/* Audiobooks Grid */}
            {audiobooks.length === 0 ? (
              <div className="text-center py-20 bg-stone-900/30 rounded-2xl border border-stone-800">
                <Search className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-stone-300 font-medium">No audiobooks match your search</p>
                <p className="text-xs text-stone-500 mt-1">
                  Try checking your spelling or selecting another category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {audiobooks.map((book) => (
                  <AudiobookCard
                    key={book.id}
                    book={book}
                    onOpenDetail={(b) => setSelectedDetailBook(b)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PERSONAL LIBRARY                                   */}
        {/* ========================================================= */}
        {currentTab === 'library' && (
          <LibraryView
            allBooks={audiobooks}
            onOpenDetail={(b) => setSelectedDetailBook(b)}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 4: LISTENING STATS                                    */}
        {/* ========================================================= */}
        {currentTab === 'stats' && <StatsView allBooks={audiobooks} />}

      </main>

      {/* Docked Mini-Player at Screen Bottom */}
      <DockedPlayer />

      {/* Fullscreen Theater Player Modal */}
      <ExpandedPlayerModal />

      {/* Book Detail & Chapter Inspector Modal */}
      <AudiobookDetailModal
        book={selectedDetailBook}
        onClose={() => setSelectedDetailBook(null)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <AudiobookAppContent />
      </AudioProvider>
    </AuthProvider>
  );
}
