import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, Menu, X, Home, Users, MessageCircle, Briefcase, User, LogOut, LogIn, Newspaper, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const baseNavItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Feed', path: '/feed', icon: Users },
  { name: 'Community', path: '/community', icon: Newspaper },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, dbUser } = useAuth();
  const displayName = dbUser?.full_name || user?.displayName || 'Account';
  const avatarUrl = user?.photoURL;

  const navItems = [...baseNavItems];
  if (isAuthenticated) {
    navItems.push({ name: 'Chat', path: '/chat', icon: MessageCircle });
    navItems.push({ name: 'Notifications', path: '/notifications', icon: Bell, badge: 3 });
    navItems.push({ name: 'Profile', path: '/profile', icon: User });
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-accent to-primary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <Flame className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              DevTinder
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  <span className="relative">
                    <Icon className="w-4 h-4" />
                    {item.badge > 0 && !isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-primary rounded-full shadow-sm shadow-primary/50" />
                    )}
                  </span>
                  {item.name}
                </Link>
              );
            })}
            
            <div className="pl-4 ml-2 border-l border-border flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-surface transition-colors">
                    {avatarUrl
                      ? <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover border border-border" />
                      : <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">{displayName[0]}</div>
                    }
                    <span className="text-sm font-medium text-text-primary max-w-24 truncate">{displayName.split(' ')[0]}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all text-sm"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 px-6 py-2 rounded-full font-medium bg-primary text-white hover:bg-primary-hover transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute w-full bg-surface border-b border-border transition-all duration-300 ease-in-out origin-top ${
        isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-border">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium bg-primary text-white hover:bg-primary-hover shadow-md transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
