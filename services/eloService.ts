import { Character, Gender } from '../types';
import { supabase } from './supabase';

// Map DB row to Frontend Type
const mapChar = (row: any): Character => ({
  id: row.id,
  name: row.name,
  series: row.series,
  gender: row.gender,
  elo: row.elo_rating,
  imageUrl: row.image_url,
  wins: row.wins || 0,
  losses: row.losses || 0,
});

export const getCharacters = async (gender?: Gender): Promise<Character[]> => {
  let query = supabase.from('characters').select('*');

  if (gender) {
    query = query.eq('gender', gender);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }

  return (data || []).map(mapChar);
};

export const submitVote = async (winnerId: string, loserId: string, userId: string): Promise<void> => {
  // Strict Server-Side Elo: We ONLY insert the vote. 
  // The Postgres trigger 'on_vote_insert' handles Elo calc and updating characters.

  const { error } = await supabase.from('votes').insert({
    winner_id: winnerId,
    loser_id: loserId,
    user_id: userId
  });

  if (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

const VOTE_LIMIT = 15; // Limit of votes per user per window
const VOTE_WINDOW_HOURS = 12; // Time window for voting

export const checkVoteLimit = async (userId: string): Promise<{ allowed: boolean; waitTimeMs?: number }> => {
  // Get timestamp for X hours ago
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - VOTE_WINDOW_HOURS);

  const { count, error } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart.toISOString());

  if (error) {
    console.error('Error checking vote limit', error);
    return { allowed: true }; // Fail open
  }

  if (count !== null && count >= VOTE_LIMIT) {
    // For simplicity in MVP, we just say "come back in 5 hours" or a generic time.
    // To be precise we'd need the oldest vote in the window, but let's just block for now.
    // A simple UX is to just tell them to wait.
    // Let's return a fixed wait time for the UI to display or calculating based on the window.
    // Effectively, if they hit the limit, they are blocked until the oldest vote falls out of the window.
    // That is hard to calc without fetching data.
    // Let's just return allowed: false.
    return { allowed: false, waitTimeMs: VOTE_WINDOW_HOURS * 60 * 60 * 1000 };
  }

  return { allowed: true };
};

export const getRandomPair = async (gender: Gender, currentWinnerId?: string): Promise<[Character, Character]> => {
  // For MVP with < 50 characters, fetching all is fine.
  // Ideally, use a Postgres function `get_random_pair` for scale.
  const pool = await getCharacters(gender);

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
  let attempts = 0;
  do {
    char2 = pool[Math.floor(Math.random() * pool.length)];
    attempts++;
    if (attempts > 50) break; // Safety break
  } while (char2.id === char1.id);

  // Fallback if we somehow failed to find a pair
  if (char1.id === char2.id) {
    return [pool[0], pool[1]];
  }

  // Randomize order for display
  return Math.random() > 0.5 ? [char1, char2] : [char2, char1];
};

// Reset is now just a "Clear Votes" which requires admin privs usually, 
// or simply reloading the page to clear local state. 
// For this MVP, we remove the local storage reset.
export const resetData = () => {
  window.location.reload();
};
