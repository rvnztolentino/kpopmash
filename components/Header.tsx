import React from 'react';
import { ViewState, User } from '../types';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLogout, onLogin }) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  return (
    <header className="bg-red-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('vote')}>
          <div className="bg-white text-red-800 font-bold px-2 py-1 rounded text-sm tracking-tighter border-2 border-white">
            KM
          </div>
          <h1 className="text-xl font-bold tracking-wide">KPOPMASH</h1>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => onNavigate('vote')} className="hover:text-red-200 transition-colors font-medium">
            Matchups
          </button>
          <button onClick={() => onNavigate('rankings')} className="hover:text-red-200 transition-colors font-medium">
            Rankings
          </button>
          <button onClick={() => onNavigate('about')} className="hover:text-red-200 transition-colors font-medium">
            About
          </button>
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className={`flex items-center space-x-3 group relative cursor-pointer`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <span className="hidden sm:inline font-medium text-sm select-none">{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-red-900 border border-red-400 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} />
                )}
              </div>

              {/* Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsProfileOpen(false); }} />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg overflow-hidden border border-gray-200 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center space-x-2 text-sm"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="text-sm bg-white text-red-800 px-4 py-1.5 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar (Sub-header) */}
      <div className="md:hidden flex justify-around bg-red-900 py-2 text-xs font-medium">
        <button onClick={() => onNavigate('vote')} className="hover:text-white/80">VOTE</button>
        <button onClick={() => onNavigate('rankings')} className="hover:text-white/80">RANKINGS</button>
        <button onClick={() => onNavigate('about')} className="hover:text-white/80">ABOUT</button>
      </div>
    </header>
  );
};

export default Header;
