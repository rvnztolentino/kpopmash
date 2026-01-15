import React from 'react';
import { Character } from '../types';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface RankingsTableProps {
  characters: Character[];
}

const RankingsTable: React.FC<RankingsTableProps> = ({ characters }) => {
  // Sort by Elo descending
  const sorted = [...characters].sort((a, b) => b.elo - a.elo);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Character</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Series</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Rating</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right hidden sm:table-cell">W/L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((char, index) => {
              const rank = index + 1;
              const winRate = char.wins + char.losses > 0 
                ? Math.round((char.wins / (char.wins + char.losses)) * 100) 
                : 0;

              return (
                <tr key={char.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 text-gray-900 font-medium">
                    <div className="flex items-center space-x-2">
                       {rank === 1 && <Trophy size={16} className="text-yellow-500" />}
                       {rank === 2 && <Trophy size={16} className="text-gray-400" />}
                       {rank === 3 && <Trophy size={16} className="text-amber-700" />}
                       <span className={rank <= 3 ? 'font-bold' : ''}>#{rank}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" loading="lazy"/>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{char.name}</div>
                        <div className="text-xs text-gray-500 md:hidden truncate">{char.series}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600 hidden md:table-cell">
                    {char.series}
                  </td>
                  <td className="py-3 px-6 text-right font-mono font-medium text-blue-600">
                    {char.elo}
                  </td>
                  <td className="py-3 px-6 text-right text-sm text-gray-500 hidden sm:table-cell">
                     <span className="text-green-600 font-medium">{char.wins}W</span>
                     <span className="mx-1 text-gray-300">/</span>
                     <span className="text-red-500 font-medium">{char.losses}L</span>
                     <div className="text-xs text-gray-400 mt-0.5">{winRate}%</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingsTable;
