import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { Audiobook } from '../types';
import { Headphones, Award, Flame, BookCheck, TrendingUp, Clock } from 'lucide-react';

interface StatsViewProps {
  allBooks: Audiobook[];
}

export const StatsView: React.FC<StatsViewProps> = ({ allBooks }) => {
  const { user, stats, library } = useAuth();
  const { userProgress } = useAudio();

  const totalSecs = stats?.totalSecondsListened || 18450;
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);

  const completedCount = stats?.booksCompleted || library.filter((i) => i.status === 'completed').length;
  const streak = stats?.listeningStreakDays || 6;

  // Active in-progress books count
  const inProgressCount = Object.keys(userProgress).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-stone-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Listening Activity & Insights
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Review your time immersed in literature, daily listening streaks, and audiobook achievements.
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Listening Time</span>
            <Headphones className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-100 tabular-nums">
              {hours}h {minutes}m
            </div>
            <p className="text-[11px] text-stone-500 mt-1">+45m streamed this session</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-100 tabular-nums">
              {streak} Days
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Consistent daily listener</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Finished Titles</span>
            <BookCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-100 tabular-nums">
              {completedCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Audiobooks fully completed</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-100 tabular-nums">
              {inProgressCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Currently open audiobooks</p>
          </div>
        </div>
      </div>

      {/* Listening Pattern Visualizer */}
      <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-stone-200">
            Weekly Listening Distribution
          </h3>
          <span className="text-xs font-mono text-stone-500">Past 7 Days</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-6 pb-2 items-end h-44">
          {[
            { day: 'Mon', mins: 45 },
            { day: 'Tue', mins: 60 },
            { day: 'Wed', mins: 35 },
            { day: 'Thu', mins: 80 },
            { day: 'Fri', mins: 50 },
            { day: 'Sat', mins: 110 },
            { day: 'Sun', mins: 95 }
          ].map((item, idx) => {
            const heightPercent = Math.min(100, Math.round((item.mins / 120) * 100));
            const isToday = idx === 6;
            return (
              <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-stone-400 tabular-nums">
                  {item.mins}m
                </span>
                <div className="w-full max-w-[42px] bg-stone-800 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday ? 'bg-amber-400' : 'bg-stone-600 hover:bg-stone-500'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-mono ${
                    isToday ? 'text-amber-400 font-bold' : 'text-stone-400'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Genre Breakdown */}
      <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-200">
          Favorite Literary Genres
        </h3>
        <div className="space-y-3">
          {[
            { genre: 'Classics & Literature', pct: 40, color: 'bg-amber-400' },
            { genre: 'Mystery & Detective', pct: 28, color: 'bg-purple-400' },
            { genre: 'Philosophy & Strategy', pct: 18, color: 'bg-red-400' },
            { genre: 'Science Fiction', pct: 14, color: 'bg-sky-400' }
          ].map((g) => (
            <div key={g.genre} className="space-y-1">
              <div className="flex justify-between text-xs text-stone-300">
                <span>{g.genre}</span>
                <span className="font-mono text-stone-400">{g.pct}%</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${g.color} rounded-full`}
                  style={{ width: `${g.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
