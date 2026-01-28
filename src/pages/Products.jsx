import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Tag, Info, CheckCircle, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/ui/Section';
import './Products.css';
import collectionService from '../services/collectionService';

const Products = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/collections';
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAllCollections();
      // Filter for active ones if needed, or assume service returns what's needed.
      // The original call was to `${API_URL}/active`.
      // My service has `getActiveExpertise` but not `getActiveCollections`. I should check `collectionService`.
      // I only added basic CRUD. I should use `getAll` and filter here, or update service.
      // Actually, checking grep results, `API_URL/active` was used.
      // I'll filter in frontend for now as `getAllCollections` returns all.
      // Wait, visitor pages should only see active ones.
      // Ideally I should add `getActiveCollections` to service.
      // Let me invoke `collectionService.getAllCollections()` and filter `.filter(c => c.isActive && c.isAvailable ?? true)`?
      // Actually the original endpoint `/active` returns only active ones.
      // I'll filter here for simplicity.
      const allCollections = await collectionService.getAllCollections();
      setCollections(allCollections.filter(c => c.isActive));
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`${BASE_URL}/api/collections/${id}/like`, { method: 'PATCH' });
      if (response.ok) {
        const data = await response.json();
        setCollections(prev => prev.map(c => c._id === id ? { ...c, likes: data.likes } : c));
      }
    } catch (error) {
       console.error('Error liking:', error);
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

                      {/* Like Button */}
                      <button 
                        onClick={(e) => handleLike(collection._id, e)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-lg"
                      >
                        <Heart size={20} className={collection.likes > 0 ? "fill-white" : ""} />
                        {collection.likes > 0 && (
                          <span className="absolute -bottom-2 -right-1 bg-amber-600 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border border-white/20">
                            {collection.likes}
                          </span>
                        )}
                      </button>

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
        )}
      </Section>
    </div>
  );
};

export default Products;
