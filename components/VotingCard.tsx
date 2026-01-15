import React from 'react';
import { Character } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface VotingCardProps {
  character: Character;
  onVote: () => void;
  isWinner?: boolean; // For post-vote feedback
  showStats?: boolean; // Whether to show stats (e.g., after voting)
}

const VotingCard: React.FC<VotingCardProps> = ({ character, onVote, isWinner, showStats }) => {
  return (
    <div 
      className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.02] w-full max-w-sm mx-auto ${isWinner ? 'scale-[1.02]' : ''}`}
      onClick={onVote}
    >
      {/* Card Container */}
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">
        
        {/* Image Area */}
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
           <img 
             src={character.imageUrl} 
             alt={character.name}
             className="w-full h-full object-cover transition-opacity duration-500"
             loading="lazy"
           />
           
           {/* Hover Overlay */}
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                Vote {character.name.split(' ')[0]}
              </div>
           </div>

           {/* Winner Badge */}
           {isWinner && (
             <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-in fade-in duration-300">
                <CheckCircle2 className="text-green-500 w-24 h-24 drop-shadow-md" />
             </div>
           )}
        </div>

        {/* Info Area */}
        <div className="p-4 text-center border-t border-gray-100 bg-white z-10 relative">
          <h2 className="text-lg font-bold text-gray-900 truncate" title={character.name}>
            {character.name}
          </h2>
          <p className="text-sm text-gray-500 truncate">{character.series}</p>
          
          {/* Stats (only shown if requested, usually in ranking or detailed view, but good for feedback) */}
          {showStats && (
             <div className="mt-2 text-xs font-mono text-gray-400">
               Elo: {character.elo} | W: {character.wins} L: {character.losses}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingCard;
