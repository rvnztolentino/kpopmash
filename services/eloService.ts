import { Character, Gender, Vote } from '../types';
import { INITIAL_FEMALE_CHARACTERS, INITIAL_MALE_CHARACTERS } from '../constants';

const K_FACTOR = 32;

// --- Mock Database Helper ---
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- Elo Logic ---
const getExpectedScore = (ratingA: number, ratingB: number): number => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

export const calculateEloChange = (winnerElo: number, loserElo: number) => {
  const expectedWinner = getExpectedScore(winnerElo, loserElo);
  const expectedLoser = getExpectedScore(loserElo, winnerElo);

  const newWinnerElo = Math.round(winnerElo + K_FACTOR * (1 - expectedWinner));
  const newLoserElo = Math.round(loserElo + K_FACTOR * (0 - expectedLoser));

  return {
    winnerNewElo: newWinnerElo,
    loserNewElo: newLoserElo,
    winnerDelta: newWinnerElo - winnerElo,
    loserDelta: newLoserElo - loserElo,
  };
};

// --- Service Methods ---

export const getCharacters = (gender?: Gender): Character[] => {
  const allChars = loadFromStorage<Character[]>('animemash_characters', [
    ...INITIAL_FEMALE_CHARACTERS,
    ...INITIAL_MALE_CHARACTERS,
  ]);
  
  if (gender) {
    return allChars.filter(c => c.gender === gender);
  }
  return allChars;
};

export const resetData = () => {
    localStorage.removeItem('animemash_characters');
    localStorage.removeItem('animemash_votes');
    window.location.reload();
}

export const submitVote = (winnerId: string, loserId: string): Vote => {
  const characters = getCharacters();
  const winnerIndex = characters.findIndex(c => c.id === winnerId);
  const loserIndex = characters.findIndex(c => c.id === loserId);

  if (winnerIndex === -1 || loserIndex === -1) {
    throw new Error('Character not found');
  }

  const winner = characters[winnerIndex];
  const loser = characters[loserIndex];

  // Calculate new Elo
  const result = calculateEloChange(winner.elo, loser.elo);

  // Update characters
  characters[winnerIndex] = {
    ...winner,
    elo: result.winnerNewElo,
    wins: winner.wins + 1,
  };
  characters[loserIndex] = {
    ...loser,
    elo: result.loserNewElo,
    losses: loser.losses + 1,
  };

  // Save Characters
  saveToStorage('animemash_characters', characters);

  // Save Vote
  const vote: Vote = {
    id: crypto.randomUUID(),
    winnerId,
    loserId,
    timestamp: Date.now(),
  };
  
  const votes = loadFromStorage<Vote[]>('animemash_votes', []);
  votes.push(vote);
  saveToStorage('animemash_votes', votes);

  return vote;
};

export const getRandomPair = (gender: Gender, currentWinnerId?: string): [Character, Character] => {
  const pool = getCharacters(gender);
  
  if (pool.length < 2) throw new Error("Not enough characters");

  let char1: Character;
  let char2: Character;

  // If we have a current winner, try to keep them
  if (currentWinnerId) {
      const found = pool.find(c => c.id === currentWinnerId);
      char1 = found || pool[Math.floor(Math.random() * pool.length)];
  } else {
      char1 = pool[Math.floor(Math.random() * pool.length)];
  }

  // Find a second character that is not the first one
  do {
    char2 = pool[Math.floor(Math.random() * pool.length)];
  } while (char2.id === char1.id);

  // Randomize order for display so winner isn't always on left if they stay
  return Math.random() > 0.5 ? [char1, char2] : [char2, char1];
};
