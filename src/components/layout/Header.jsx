import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe, Search, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, switchLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowLangMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos Produits', path: '/products' },
    { name: 'Réalisations', path: '/portfolio' },
    { name: 'À Propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    })
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-2xl' : 'shadow-md'
      }`}
    >
      {/* TOP ROW: Amazon-style main header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`
          flex items-center gap-3 px-4 lg:px-6 py-3 transition-all duration-300
          ${isScrolled 
            ? 'bg-white dark:bg-slate-800 shadow-md' 
            : 'bg-gray-50 dark:bg-slate-900'
          }
          text-gray-900 dark:text-white h-16 md:h-[72px] backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-slate-700
        `}
      >
        {/* Mobile Toggle */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </motion.button>

        {/* Logo with animation */}
        <Link to="/" className="flex items-center gap-2 mr-2 lg:mr-6 flex-shrink-0 group">
          <motion.img 
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            src="/logo.png" 
            alt="Bakaba Stone" 
            className="h-9 w-auto object-contain"
            onError={(e) => e.target.style.display = 'none'} 
          />
          <div className="flex flex-col leading-none">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-heading font-bold text-xl uppercase tracking-wide text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
            >
              Bakaba
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[0.65rem] font-semibold tracking-widest uppercase text-amber-600 dark:text-amber-400"
            >
              Stone
            </motion.span>
          </div>
        </Link>

        {/* Search Bar - Amazon style */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleSearch} 
          className="hidden md:flex flex-1 max-w-3xl mx-auto h-10 relative group"
        >
          <input 
            type="text" 
            placeholder="Rechercher des pierres, réalisations..." 
            className="w-full h-full px-4 text-sm text-gray-900 border-none outline-none rounded-l-md focus:ring-2 focus:ring-yellow-500 transition-all duration-200 placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="h-full px-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white flex items-center justify-center transition-all duration-200 rounded-r-md shadow-lg"
          >
            <Search size={20} className="font-bold" />
          </motion.button>
        </motion.form>

        {/* Actions (Right) - Amazon style */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 ml-2">
          {/* Language Selector */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200 border border-gray-300 dark:border-white/20"
            >
              <Globe size={18} />
              <span className="text-sm font-semibold">{language}</span>
            </motion.button>
            
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-white text-gray-800 shadow-2xl rounded-lg p-2 min-w-[160px] flex flex-col gap-1 ring-1 ring-black/10"
                >
                  {[
                    { code: 'FR', name: 'Français', flag: '🇫🇷' },
                    { code: 'EN', name: 'English', flag: '🇬🇧' },
                    { code: 'CN', name: '中文', flag: '🇨🇳' }
                  ].map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ x: 5, backgroundColor: '#f3f4f6' }}
                      className="text-left px-3 py-2.5 text-sm rounded flex items-center gap-2 transition-colors"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        switchLanguage(lang.code); 
                        setShowLangMenu(false); 
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme} 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200 border border-gray-300 dark:border-white/20"
            aria-label="Toggle Theme"
          >
            <motion.div
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* BOTTOM ROW: Navigation - Amazon style */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`
          hidden md:flex items-center px-4 lg:px-6 h-11 overflow-x-auto scrollbar-hide
          ${isScrolled 
            ? 'bg-gray-100 dark:bg-slate-700' 
            : 'bg-gray-200 dark:bg-slate-800'
          }
          text-gray-900 dark:text-white border-b-2 border-amber-500 shadow-lg
        `}
      >
        <nav className="flex gap-1 lg:gap-2 h-full items-center container mx-auto">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <NavLink 
                to={link.path}
                className={({ isActive }) => `
                  text-sm font-medium whitespace-nowrap px-4 py-2 rounded-md transition-all duration-200
                  relative overflow-hidden group
                  ${isActive 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10'
                  }
                `}
              >
                <span>{link.name}</span>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-amber-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[320px] bg-gradient-to-b from-slate-900 to-slate-800 z-[70] shadow-2xl flex flex-col"
            >
              {/* Mobile Header */}
              <div className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white p-6 flex flex-col gap-4 border-b-2 border-amber-500">
                <div className="flex items-center justify-between">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-heading font-bold text-xl flex items-center gap-2"
                  >
                    <User size={24} />
                    Menu
                  </motion.span>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                
                {/* Mobile Actions */}
                <div className="flex gap-2 flex-wrap">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme} 
                    className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-white/20 transition-all border border-gray-300 dark:border-white/20"
                  >
                    {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                    {isDarkMode ? 'Sombre' : 'Clair'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => switchLanguage(language === 'FR' ? 'EN' : 'FR')} 
                    className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-white/20 transition-all border border-gray-300 dark:border-white/20"
                  >
                    <Globe size={16} />
                    {language}
                  </motion.button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 bg-white">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <NavLink 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        block px-6 py-4 text-base font-medium border-l-4 transition-all duration-200
                        ${isActive 
                          ? 'border-amber-600 text-amber-700 bg-amber-50 shadow-inner' 
                          : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                        }
                      `}
                    >
                      <span>{link.name}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
