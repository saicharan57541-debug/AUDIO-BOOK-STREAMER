import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const ok = await login(email, password);
        if (ok) {
          onClose();
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        const ok = await register(name, email, password);
        if (ok) {
          onClose();
        } else {
          setError('Could not register account. Email may already be in use.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsLoading(true);
    const ok = await login('eleanor@aurabooks.com', 'password123');
    setIsLoading(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-stone-100">
            {mode === 'login' ? 'Sign In to AuraBooks' : 'Create an Account'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Access your listening history, saved bookmarks, and custom soundscapes.
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
          <p className="text-xs text-amber-300 font-medium mb-2">Want to test right away?</p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Instant Demo Sign In (Eleanor Hawthorne)
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-800 mb-5 text-xs font-medium">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 pb-2 border-b-2 text-center transition-colors cursor-pointer ${
              mode === 'login'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 pb-2 border-b-2 text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Austen"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="listener@example.com"
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
