import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import VotingCard from './components/VotingCard';
import RankingsTable from './components/RankingsTable';
import { Character, Gender, User, ViewState } from './types';
import { getRandomPair, submitVote, getCharacters, resetData } from './services/eloService';
import { HashRouter } from 'react-router-dom'; // Included for type safety even if unused directly since we manage state manually for simplicity here
import { Lock, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>('vote');
  const [category, setCategory] = useState<Gender>('female');
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingPair, setIsLoadingPair] = useState(false);
  
  // The current pair to vote on
  const [pair, setPair] = useState<[Character, Character] | null>(null);
  
  // Track the ID of the last winner to keep them on screen
  const [streakWinnerId, setStreakWinnerId] = useState<string | undefined>(undefined);

  // --- Effects ---

  // Check auth on mount (mock)
  useEffect(() => {
    const storedUser = localStorage.getItem('animemash_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Load initial pair
    loadNewPair();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once

  // Reload pair when category changes
  useEffect(() => {
    setStreakWinnerId(undefined); // Reset streak when category changes
    loadNewPair(true); // Force new pair
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);


  // --- Logic ---

  const loadNewPair = (resetStreak = false) => {
    setIsLoadingPair(true);
    // Tiny timeout to simulate network/feeling of refresh
    setTimeout(() => {
      try {
        const winnerToKeep = resetStreak ? undefined : streakWinnerId;
        const newPair = getRandomPair(category, winnerToKeep);
        setPair(newPair);
      } catch (e) {
        console.error("Failed to load pair", e);
      } finally {
        setIsLoadingPair(false);
      }
    }, 400);
  };

  const handleLogin = () => {
    // Mock login
    const mockUser: User = {
      id: 'u1',
      name: 'Otaku Fan',
      email: 'fan@example.com',
      avatarUrl: '',
    };
    setUser(mockUser);
    localStorage.setItem('animemash_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('animemash_user');
  };

  const handleVote = (winner: Character, loser: Character) => {
    if (!user) return; // Should be blocked by UI, but safety check

    // 1. Submit vote (updates local storage / mock backend)
    submitVote(winner.id, loser.id);

    // 2. Update logic: Winner stays
    setStreakWinnerId(winner.id);

    // 3. Load next pair
    loadNewPair();
  };
  
  const handleReset = () => {
      if(confirm('Are you sure you want to reset all rankings?')) {
          resetData();
      }
  }

  // --- Render Helpers ---

  const renderContent = () => {
    if (view === 'vote') {
        if (!user) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to Vote</h2>
                        <p className="text-gray-500 mb-8">
                            Join the community to rank your favorite characters. 
                            Your votes help decide who is truly the best!
                        </p>
                        <button 
                            onClick={handleLogin}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
                        >
                            Sign in with Google
                        </button>
                    </div>
                </div>
            )
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
        const characters = getCharacters(category);
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
                <RankingsTable characters={characters} />
            </div>
        );
    }

    if (view === 'about') {
        return (
             <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">About AnimeMash</h2>
                    
                    <div className="prose prose-red text-gray-600">
                        <p className="mb-4">
                            AnimeMash is a crowd-sourced ranking platform inspired by the classic Facemash concept, but for Anime characters.
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
                             Reset Demo Data
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
