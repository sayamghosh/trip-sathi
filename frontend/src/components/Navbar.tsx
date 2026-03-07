import { useState, useRef, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, PlaneTakeoff, Bell, Settings } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthFlow } from '../context/AuthFlowContext';
import LoginModal from './LoginModal';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthFlow();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate({ to: '/' });
  };

  return (
    <nav className="fixed w-full z-50 bg-[#F0F9FF]/90 backdrop-blur-md border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-20 h-20 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold text-[#1a2b4c] tracking-tight">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors">About</Link>
            <a href="#" className="text-sm font-semibold  text-gray-800 hover:text-brand-primary transition-colors">Gallery</a>
            <a href="#" className="text-sm font-semibold  text-gray-800 hover:text-brand-primary transition-colors">Packages</a>
            <a href="#" className="text-sm font-semibold  text-gray-800 hover:text-brand-primary transition-colors">Blog</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-5 ml-auto">
            {/* <button className="relative text-[#1a2b4c] hover:text-brand-primary transition-colors">
              <Bell size={22} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="text-[#1a2b4c] hover:text-brand-primary transition-colors">
              <Settings size={22} />
            </button> */}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => isAuthenticated ? setIsProfileOpen(!isProfileOpen) : openLoginModal()}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none"
              >
                {isAuthenticated && user?.picture ? (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon size={18} className="text-gray-400" />
                )}
              </button>

                <AnimatePresence>
                  {isProfileOpen && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-sky-100 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-sky-50/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        {user?.role === 'guide' && (
                          <Link to="/guide/dashboard" className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-brand-primary rounded-lg flex items-center gap-2 transition-colors">
                            Guide Dashboard
                          </Link>
                        )}
                        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-brand-primary rounded-lg flex items-center gap-2 transition-colors">
                          <UserIcon size={18} />
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors mt-1"
                        >
                          <LogOut size={18} />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-brand-primary focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-sky-100 overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-4">
              <Link to="/about" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary" onClick={() => setIsOpen(false)}>About</Link>
              <a href="#" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary" onClick={() => setIsOpen(false)}>Gallery</a>
              <a href="#" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary" onClick={() => setIsOpen(false)}>Packages</a>
              <a href="#" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary" onClick={() => setIsOpen(false)}>Blog</a>
              {isAuthenticated && user?.role === 'guide' ? (
                <Link to="/guide/dashboard" className="block py-2 text-lg font-bold text-brand-primary hover:text-brand-dark" onClick={() => setIsOpen(false)}>Guide Dashboard</Link>
              ) : !isAuthenticated ? (
                <Link to="/become-a-guide" className="block py-2 text-lg font-bold text-brand-primary hover:text-brand-dark" onClick={() => setIsOpen(false)}>Become a Tour Guide</Link>
              ) : null}
              <div className="pt-4 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <button onClick={() => { setIsOpen(false); openLoginModal(); }} className="block w-full text-center px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-secondary cursor-pointer">
                    Log In / Sign Up
                  </button>
                ) : (
                  <div className="border border-sky-100 rounded-xl overflow-hidden bg-sky-50/30">
                    <div className="p-4 flex items-center gap-3 border-b border-sky-100 bg-white">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow-sm">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="p-2 space-y-1 bg-white">
                      <button className="w-full text-left px-4 py-3 font-medium text-gray-700 hover:bg-sky-50 hover:text-brand-primary rounded-lg flex items-center gap-3">
                        <UserIcon size={20} className="text-gray-400" />
                        My Profile
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3">
                        <LogOut size={20} className="text-red-400" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </nav>
  );
};

export default Navbar;
