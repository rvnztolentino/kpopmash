import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Info Section */}
      <div className="bg-gray-900 py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-semibold">About kpopmash</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Vote for the best K-pop idols! It uses the Elo rating system to calculate rankings based on your pairwise choices.
            If you change your mind on a pair, your new vote overrides the old one.
          </p>

          <div className="pt-4 flex justify-center space-x-6 text-sm font-medium">
            <button onClick={() => onNavigate('vote')} className="text-gray-400 hover:text-gray-300">Submit Rankings</button>
            <button onClick={() => onNavigate('rankings')} className="text-gray-400 hover:text-gray-300">View Leaderboard</button>
          </div>

          <p className="text-xs text-gray-600 pt-6">
            &copy; {new Date().getFullYear()} Kpopmash. Images belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
