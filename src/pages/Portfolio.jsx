import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Maximize2, Tag, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/ui/Section';
import './Portfolio.css';
import projectService from '../services/projectService';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api/projects';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleLike = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/${id}/like`, { method: 'PATCH' });
      if (response.ok) {
        const data = await response.json();
        setProjects(prev => prev.map(p => p._id === id ? { ...p, likes: data.likes } : p));
      }
    } catch (error) {
       console.error('Error liking:', error);
    }
  };

  return (
    <div className="portfolio-page min-h-screen transition-colors duration-300">
      <div className="page-header relative overflow-hidden">
        {/* Background decoration for header */}
        <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-6"
          >
            Nos Réalisations
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
            Découvrez comment nous transformons la pierre brute en véritable art architectural.
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
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link 
                    to={`/project/${project._id}`}
                    className="block group"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 h-full relative">
                      
                      {/* Image Container */}
                      <div className="relative h-80 overflow-hidden">
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.7 }}
                          src={project.imageUrl ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${project.imageUrl}`) : ''} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-2 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2">
                            <Tag size={12} /> {project.category}
                          </span>
                        </div>

                        {/* Like Button */}
                        <button 
                          onClick={(e) => handleLike(project._id, e)}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-lg"
                        >
                          <Heart size={20} className={project.likes > 0 ? "fill-white" : ""} />
                          {project.likes > 0 && (
                            <span className="absolute -bottom-2 -right-1 bg-amber-600 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border border-white/20">
                              {project.likes}
                            </span>
                          )}
                        </button>

                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                            <ArrowRight size={32} className="text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content Overlay - Always visible at bottom */}
                      <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl font-heading font-bold mb-2 group-hover:text-amber-400 transition-colors">
                          {project.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-3 opacity-80 group-hover:opacity-100 transition-opacity delay-100">
                          {project.dimensions && (
                            <span className="flex items-center gap-1.5 text-xs font-medium bg-white/10 backdrop-blur-sm px-2 py-1 rounded">
                              <Maximize2 size={12} /> {project.dimensions}
                            </span>
                          )}
                          {project.totalPrice > 0 && (
                            <span className="flex items-center gap-1.5 text-xs font-medium bg-white/10 backdrop-blur-sm px-2 py-1 rounded">
                              {project.totalPrice.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Decorative Line */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Section>
    </div>
  );
};

export default Portfolio;
