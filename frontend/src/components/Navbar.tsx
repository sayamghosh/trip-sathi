import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#F0F9FF]/90 backdrop-blur-md border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-bold text-brand-primary tracking-tight">
              Trip<span className="text-brand-dark">Sathi</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-gray-600 font-medium hover:text-brand-primary transition-colors">Packages</Link>
            <Link to="/guides" className="text-gray-600 font-medium hover:text-brand-primary transition-colors">Local Guides</Link>
            <Link to="/about" className="text-gray-600 font-medium hover:text-brand-primary transition-colors">About</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-brand-dark font-semibold hover:text-brand-primary">Log In</Link>
            <Link
              to="/signup"
              className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-sky-200"
            >
              Sign Up
            </Link>
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
              <Link to="/" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary">Packages</Link>
              <Link to="/guides" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary">Local Guides</Link>
              <Link to="/about" className="block py-2 text-lg font-medium text-gray-700 hover:text-brand-primary">About</Link>
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/login" className="block w-full text-center px-6 py-3 border border-sky-200 rounded-xl font-semibold text-brand-dark hover:bg-sky-50">Log In</Link>
                <Link to="/signup" className="block w-full text-center px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-secondary">Sign Up</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
