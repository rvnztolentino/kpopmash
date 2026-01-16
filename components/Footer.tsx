import React from 'react';
import { Gender, ViewState } from '../types';

interface FooterProps {
  currentCategory: Gender;
  onSelectCategory: (gender: Gender) => void;
  onNavigate: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ currentCategory, onSelectCategory, onNavigate }) => {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      {/* Category Selection Bar */}
      <div className="container mx-auto">
        <div className="flex w-full text-center">
          <button
            onClick={() => onSelectCategory('female')}
            className={`flex-1 py-4 font-bold text-lg tracking-wider transition-colors duration-200 ${currentCategory === 'female'
                ? 'bg-blue-800 text-white border-b-4 border-white'
                : 'bg-blue-900 text-blue-300 hover:bg-blue-800 hover:text-white'
              }`}
          >
            FEMALE
          </button>
          <button
            onClick={() => onSelectCategory('male')}
            className={`flex-1 py-4 font-bold text-lg tracking-wider transition-colors duration-200 ${currentCategory === 'male'
                ? 'bg-blue-800 text-white border-b-4 border-white'
                : 'bg-blue-900 text-blue-300 hover:bg-blue-800 hover:text-white'
              }`}
          >
            MALE
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-900 py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-semibold">About Kpopmash</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Vote for the best K-pop idols! We use the Elo rating system to calculate rankings based on your pairwise choices.
            If you change your mind on a pair, your new vote overrides the old one.
          </p>

          <div className="pt-4 flex justify-center space-x-6 text-sm font-medium">
            <button onClick={() => onNavigate('vote')} className="text-blue-400 hover:text-blue-300">Submit Rankings</button>
            <button onClick={() => onNavigate('rankings')} className="text-blue-400 hover:text-blue-300">View Leaderboard</button>
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
