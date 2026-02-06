import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Info, CheckCircle, XCircle, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/ui/Section';
import './Products.css';
import collectionService from '../services/collectionService';

const Products = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCollections, setTotalCollections] = useState(0);

  const API_URL = '/api/collections';
  const BASE_URL = '';
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchCollections();
  }, [currentPage]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      if (data.collections) {
        setCollections(data.collections.filter(c => c.isActive));
        setTotalPages(data.totalPages || 1);
        setTotalCollections(data.totalCollections || 0);
      } else {
        // Fallback for non-paginated response
        setCollections(data.filter(c => c.isActive));
        setTotalPages(1);
        setTotalCollections(data.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return BASE_URL + imageUrl;
  };

  return (
    <div className="products-page min-h-screen transition-colors duration-300">
      <div className="page-header relative overflow-hidden">
        {/* Background decoration for header */}
        <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-6"
          >
            Nos Collections
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light"
          >
            Une sélection rigoureuse de pierres naturelles pour sublimer vos espaces intérieurs et extérieurs.
          </motion.p>
        </div>
      </div>

      <Section className="!pt-16 !pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-4">
              <AnimatePresence>
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 h-full flex flex-col relative">
                      
                      {/* Image Area */}
                      <div className="relative h-72 overflow-hidden">
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={getImageSrc(collection.imageUrl)} 
                          alt={collection.name} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {collection.isAvailable ? (
                            <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                              <CheckCircle size={12} /> En Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                              <XCircle size={12} /> Sur Commande
                            </span>
                          )}
                        </div>

                        {/* Price Tag */}
                        {collection.pricePerM2 > 0 && (
                          <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-lg px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700">
                            <div className="flex flex-col items-end leading-none">
                              <span className="text-amber-600 dark:text-amber-500 font-bold text-lg">
                                {collection.pricePerM2.toLocaleString()} <span className="text-xs text-gray-500 dark:text-gray-400">FCFA</span>
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">par m²</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <Link to={`/collection/${collection._id}`} className="group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white line-clamp-1">
                              {collection.name}
                            </h3>
                          </Link>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                          {collection.description}
                        </p>

                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                          <Link 
                            to={`/collection/${collection._id}`}
                            className="text-gray-900 dark:text-white font-semibold text-sm flex items-center gap-2 group/link hover:text-amber-600 dark:hover:text-amber-500 transition-all"
                          >
                            Voir les détails
                            <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                          
                          <button className="text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                            <ShoppingBag size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Decorative Bottom Line */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center gap-4 mt-12"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:hover:text-gray-900 dark:disabled:hover:text-white flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Précédent
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-amber-500 text-white'
                          : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:hover:text-gray-900 dark:disabled:hover:text-white flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </Section>
    </div>
  );
};

export default Products;
