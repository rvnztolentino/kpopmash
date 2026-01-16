import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import VotingCard from './components/VotingCard';
import RankingsTable from './components/RankingsTable';
import { Character, Gender, User, ViewState } from './types';
import { getRandomPair, submitVote, getCharacters, resetData, checkVoteLimit } from './services/eloService';
import { supabase } from './services/supabase';
import { Loader2, Lock } from 'lucide-react';
import Login from './components/Login';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>('vote');
  const [category, setCategory] = useState<Gender>('female');

  const [user, setUser] = useState<User | null>(null);
  const [isLoadingPair, setIsLoadingPair] = useState(false);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);

  // The current pair to vote on
  const [pair, setPair] = useState<[Character, Character] | null>(null);

  // Rankings data
  const [rankings, setRankings] = useState<Character[]>([]);

  // Track the ID of the last winner to keep them on screen
  const [streakWinnerId, setStreakWinnerId] = useState<string | undefined>(undefined);

  // Rate Limiting
  const [isVoteLocked, setIsVoteLocked] = useState(false);

  // --- Effects ---

  // Auth Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatarUrl: session.user.user_metadata.avatar_url || '',
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatarUrl: session.user.user_metadata.avatar_url || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initial Load
  useEffect(() => {
    loadNewPair();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload pair when category changes
  useEffect(() => {
    setStreakWinnerId(undefined); // Reset streak when category changes
    loadNewPair(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Reload rankings when entering rankings view
  useEffect(() => {
    if (view === 'rankings') {
      loadRankings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, category]);


  // --- Logic ---

  const loadNewPair = async (resetStreak = false) => {
    // Check limit if user exists
    if (user) {
      const { allowed } = await checkVoteLimit(user.id);
      if (!allowed) {
        setIsVoteLocked(true);
        setIsLoadingPair(false);
        return;
      }
    }

    setIsLoadingPair(true);
    try {
      const winnerToKeep = resetStreak ? undefined : streakWinnerId;
      const newPair = await getRandomPair(category, winnerToKeep);
      setPair(newPair);
    } catch (e) {
      console.error("Failed to load pair", e);
    } finally {
      setIsLoadingPair(false);
    }
  };

  const loadRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const chars = await getCharacters(category);
      setRankings(chars);
    } catch (e) {
      console.error("Failed to load rankings", e);
    } finally {
      setIsLoadingRankings(false);
    }
  }

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleVote = async (winner: Character, loser: Character) => {
    if (!user) return;

    // Optimistic update: Winner stays immediately
    setStreakWinnerId(winner.id);

    // Load next pair immediately (optimistic UI)
    loadNewPair();

    try {
      // Submit vote in background
      await submitVote(winner.id, loser.id, user.id);
    } catch (e) {
      console.error("Vote failed to submit", e);
      // Could show toast error here
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all rankings?')) {
      resetData();
    }
  }

  // --- Render Helpers ---

  const renderContent = () => {
    if (view === 'vote') {
      if (!user) {
        return <Login onLogin={handleLogin} />;
      }

      if (isVoteLocked) {
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Voting Locked</h2>
              <p className="text-gray-500 mb-8">
                You have reached the voting limit for now.
                Please come back later or explore the rankings!
              </p>
              <button
                onClick={() => setView('rankings')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-md"
              >
                View Rankings
              </button>
            </div>
          </div>
        );
      }

      if (isLoadingPair || !pair) {
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
        )
      }

      return (
        <div className="flex flex-col items-center animate-in fade-in duration-500">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center">
            Who is better?
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-4xl px-4">
            <div className="w-full md:w-1/2 flex justify-center">
              <VotingCard
                character={pair[0]}
                onVote={() => handleVote(pair[0], pair[1])}
              />
            </div>

            <div className="flex items-center justify-center">
              <span className="bg-gray-200 text-gray-500 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm shadow-inner">
                OR
              </span>
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              <VotingCard
                character={pair[1]}
                onVote={() => handleVote(pair[1], pair[0])}
              />
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-400">
            Click on the character to cast your vote.
          </div>
        </div>
      );
    }

    if (view === 'rankings') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category === 'female' ? 'Female' : 'Male'} Rankings
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Top 20
            </span>
          </div>
          {isLoadingRankings ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <RankingsTable characters={rankings} />
          )}
        </div>
      );
    }

    if (view === 'about') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">About Kpopmash</h2>

            <div className="prose prose-red text-gray-600">
              <p className="mb-4">
                Kpopmash is a crowd-sourced ranking platform inspired by the classic Facemash concept, but for K-pop idols.
              </p>
              <p className="mb-4">
                We use the <strong>Elo rating system</strong>—the same system used to rank chess players—to ensure a fair and dynamic leaderboard.
                When you vote for a character, their rating goes up, and the opponent's goes down, based on the strength of their previous ratings.
              </p>
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">How it works</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are presented with two random characters from the same category.</li>
                <li>Click on the one you prefer.</li>
                <li>The system calculates the new ratings immediately.</li>
                <li>If a character wins against a high-rated opponent, they gain more points!</li>
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-400">Version 1.0.0 (Demo)</span>
              <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-600 underline">
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header
        onNavigate={setView}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-grow py-8">
        {renderContent()}
      </main>

      <Footer
        currentCategory={category}
        onSelectCategory={setCategory}
        onNavigate={setView}
      />
    </div>
  );
};

export default App;
