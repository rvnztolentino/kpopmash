export type Gender = 'male' | 'female';

export interface Character {
  id: string;
  name: string;
  series: string;
  gender: Gender;
  elo: number;
  imageUrl: string;
  wins: number;
  losses: number;
}

export interface Vote {
  id: string;
  winnerId: string;
  loserId: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export type ViewState = 'vote' | 'rankings' | 'about';
