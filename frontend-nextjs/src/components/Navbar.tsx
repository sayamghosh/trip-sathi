"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, User as UserIcon, LogOut, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAuthFlow } from "../context/AuthFlowContext";
import dynamic from 'next/dynamic';
const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
import NavbarSearch from "./NavbarSearch";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/packages", label: "Packages" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthFlow();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isPackagesSearchVisible, setIsPackagesSearchVisible] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setIsSearchExpanded(false);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleVisibility = (e: any) => {
      setIsPackagesSearchVisible(e.detail.isVisible);
    };
    window.addEventListener('packagesSearchVisibility', handleVisibility);
    return () => window.removeEventListener('packagesSearchVisibility', handleVisibility);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Show search icon based on page and scroll position
      if (pathname === "/") {
        setShowSearch(currentScrollY > 400);
      } else if (pathname === "/packages") {
        setShowSearch(!isPackagesSearchVisible);
      } else {
        setShowSearch(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check on mount/navigation
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isPackagesSearchVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    router.push("/");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm lg:bg-transparent ${
        scrolled ? "lg:bg-white/95 lg:backdrop-blur-md lg:shadow-sm" : ""
      }`}
    >
      {/* Desktop Navbar Wrapper */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-15 items-center relative">
          {/* Desktop Navigation Links */}
          <div className="flex items-center">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className={`text-[16px] font-medium transition-colors ${
                    pathname === item.href
                      ? "text-[#1458df] "
                      : "text-gray-600 hover:text-[#1458df]"
                  }`}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <div className="h-4 w-px mx-4 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Logo (Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link
              href="/"
              className="text-[24px] font-bold tracking-tight text-gray-900 transition-colors"
            >
              tripsathi
            </Link>
          </div>

          {/* Action Buttons / Profile */}
          <div className="flex items-center relative" ref={dropdownRef}>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavbarSearch isMobile={false} />
                </motion.div>
              )}
            </AnimatePresence>
            {!isAuthenticated ? (
              <button
                onClick={openLoginModal}
                className="px-7 py-2.5 cursor-pointer rounded-full text-[16px] font-medium bg-[#1458df] text-white hover:bg-[#1049ba] transition-all"
              >
                Sign In
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all border overflow-hidden bg-gray-100 border-gray-200 cursor-pointer"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={18} />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                        <p className="text-[16px] font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[14px] text-gray-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <button className="w-full text-left px-4 py-2.5 cursor-pointer text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1458df] rounded-lg flex items-center gap-2 transition-colors">
                          <UserIcon size={18} className="text-gray-400" />
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left cursor-pointer px-4 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors mt-1"
                        >
                          <LogOut size={18} className="text-red-400" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navbar Wrapper */}
      <div className="lg:hidden w-full px-4">
        <AnimatePresence mode="wait">
          {isSearchExpanded ? (
            /* Active Full-width Search Bar Row */
            <motion.div
              key="mobile-search-active"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center h-15 w-full gap-3 py-2"
            >
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="p-2 -ml-2 text-gray-600 hover:text-black focus:outline-none transition-colors cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="flex-1">
                <NavbarSearch isMobile={true} autoFocus={true} onClose={() => setIsSearchExpanded(false)} />
              </div>
            </motion.div>
          ) : (
            /* Normal Layout: Logo row + Search row */
            <motion.div
              key="mobile-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col w-full pb-3"
            >
              {/* Row 1: Logo & Hamburgers */}
              <div className="flex justify-between h-15 items-center relative w-full">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-[24px] font-bold tracking-tight text-gray-900 transition-colors"
                  >
                    tripsathi
                  </Link>
                </div>

                <div className="flex items-center ml-auto">
                  {isAuthenticated ? (
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="focus:outline-none cursor-pointer p-1"
                      aria-label="Toggle profile menu"
                    >
                      {isOpen ? (
                        <X size={26} className="text-gray-600 hover:text-black transition-colors" />
                      ) : (
                        <div className="w-8 h-8 rounded-full border overflow-hidden bg-gray-100 border-gray-200 hover:border-gray-400 transition-all duration-200 flex items-center justify-center">
                          {user?.picture ? (
                            <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={14} className="text-gray-500" />
                          )}
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="text-gray-600 hover:text-black p-2 focus:outline-none transition-colors cursor-pointer"
                      aria-label="Toggle menu"
                    >
                      {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Amazon Style Search Bar */}
              <div className="w-full mt-0.5">
                <div 
                  onClick={() => setIsOpen(false) /* Close drawer if open */}
                  className="w-full"
                >
                  <div
                    onClick={() => setIsSearchExpanded(true)}
                    className="w-full relative flex items-center bg-gray-50/80 hover:bg-white hover:border-[#1458df]/30 border border-gray-200 rounded-full py-2 px-3.5 cursor-pointer transition-all duration-200"
                  >
                    <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                    <span className="text-[13px] font-medium text-gray-400">Search destinations...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-[14px] font-medium transition-colors ${
                    pathname === item.href
                      ? "text-black underline underline-offset-4"
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openLoginModal();
                    }}
                    className="block w-full text-center px-6 py-3 bg-black text-white rounded-xl text-[14px] font-semibold hover:bg-zinc-800 cursor-pointer"
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                    <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xl">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-[14px] font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[12px] text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <button className="w-full text-left px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg flex items-center gap-3">
                        <UserIcon size={20} className="text-gray-400" />
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3"
                      >
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
