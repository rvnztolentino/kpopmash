import { Character } from './types';

// Helper to generate a consistent placeholder image based on ID
const getImageUrl = (id: string) => `https://picsum.photos/seed/${id}/400/500`;

const createChar = (id: string, name: string, series: string, gender: 'male' | 'female'): Character => ({
  id,
  name,
  series,
  gender,
  elo: 1500,
  imageUrl: getImageUrl(id),
  wins: 0,
  losses: 0,
});

export const INITIAL_FEMALE_CHARACTERS: Character[] = [
  createChar('f1', 'Yor Forger', 'Spy x Family', 'female'),
  createChar('f2', 'Mikasa Ackerman', 'Attack on Titan', 'female'),
  createChar('f3', 'Rem', 'Re:Zero', 'female'),
  createChar('f4', 'Emilia', 'Re:Zero', 'female'),
  createChar('f5', 'Zero Two', 'Darling in the Franxx', 'female'),
  createChar('f6', 'Hinata Hyuga', 'Naruto', 'female'),
  createChar('f7', 'Asuna Yuuki', 'Sword Art Online', 'female'),
  createChar('f8', 'Saber', 'Fate/stay night', 'female'),
  createChar('f9', 'Rukia Kuchiki', 'Bleach', 'female'),
  createChar('f10', 'Bulma', 'Dragon Ball', 'female'),
  createChar('f11', 'Nami', 'One Piece', 'female'),
  createChar('f12', 'Erza Scarlet', 'Fairy Tail', 'female'),
  createChar('f13', 'Kaguya Shinomiya', 'Kaguya-sama', 'female'),
  createChar('f14', 'Yoko Littner', 'Gurren Lagann', 'female'),
  createChar('f15', 'Taiga Aisaka', 'Toradora!', 'female'),
  createChar('f16', 'Megumin', 'KonoSuba', 'female'),
  createChar('f17', 'Hitagi Senjougahara', 'Monogatari', 'female'),
  createChar('f18', 'Tsunade', 'Naruto', 'female'),
  createChar('f19', 'Ochaco Uraraka', 'My Hero Academia', 'female'),
  createChar('f20', 'Winry Rockbell', 'Fullmetal Alchemist', 'female'),
];

export const INITIAL_MALE_CHARACTERS: Character[] = [
  createChar('m1', 'Loid Forger', 'Spy x Family', 'male'),
  createChar('m2', 'Naruto Uzumaki', 'Naruto', 'male'),
  createChar('m3', 'Levi Ackerman', 'Attack on Titan', 'male'),
  createChar('m4', 'Tanjiro Kamado', 'Demon Slayer', 'male'),
  createChar('m5', 'Light Yagami', 'Death Note', 'male'),
  createChar('m6', 'Guts', 'Berserk', 'male'),
  createChar('m7', 'Ichigo Kurosaki', 'Bleach', 'male'),
  createChar('m8', 'L', 'Death Note', 'male'),
  createChar('m9', 'Edward Elric', 'Fullmetal Alchemist', 'male'),
  createChar('m10', 'Eren Yeager', 'Attack on Titan', 'male'),
  createChar('m11', 'Monkey D. Luffy', 'One Piece', 'male'),
  createChar('m12', 'Sasuke Uchiha', 'Naruto', 'male'),
  createChar('m13', 'Kirito', 'Sword Art Online', 'male'),
  createChar('m14', 'Rintarou Okabe', 'Steins;Gate', 'male'),
  createChar('m15', 'Shoto Todoroki', 'My Hero Academia', 'male'),
  createChar('m16', 'Koro-sensei', 'Assassination Classroom', 'male'),
  createChar('m17', 'Spike Spiegel', 'Cowboy Bebop', 'male'),
  createChar('m18', 'Gintoki Sakata', 'Gintama', 'male'),
  createChar('m19', 'Senku Ishigami', 'Dr. Stone', 'male'),
  createChar('m20', 'Meliodas', 'Seven Deadly Sins', 'male'),
];
