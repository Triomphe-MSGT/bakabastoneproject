import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';
import expertiseService from '../services/expertiseService';
import testimonialService from '../services/testimonialService';
import projectService from '../services/projectService';
import teamService from '../services/teamService';
import { useEffect, useState } from 'react';

const heroImages = [
  "https://res.cloudinary.com/dxtyreyse/image/upload/v1769627368/bakaba-static/stone-1.png",
  "https://res.cloudinary.com/dxtyreyse/image/upload/v1769627390/bakaba-static/stone-texture.png",
  "https://res.cloudinary.com/dxtyreyse/image/upload/v1769627372/bakaba-static/stone-house.png",
  "https://res.cloudinary.com/dxtyreyse/image/upload/v1769628842/bakaba-static/mmyrp1hwshoytx6mlxsf.jpg",
  "https://res.cloudinary.com/dxtyreyse/image/upload/v1769628892/bakaba-static/locyubpenfdfneggpahr.png"
];

const Home = () => {
  const [expertises, setExpertises] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [teamPreview, setTeamPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  /* 
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);
  */

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  useEffect(() => {
    fetchExpertises();
    fetchTestimonials();
    fetchProjects();
    fetchTeam();
  }, []);

  const fetchExpertises = async () => {
    try {
      const data = await expertiseService.getActiveExpertise();
      setExpertises(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des expertises:', error);
      setExpertises([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      // Take first 3 projects for the home page or specific 'featured' if available
      setRecentProjects(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTeam = async () => {
    try {
      const data = await teamService.getAllTeamMembers();
      setTeamPreview(data.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching team:', error);
      setTeamPreview([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      // Fetch only approved testimonials
      const data = await testimonialService.getAllTestimonials();
      // Filter for approved testimonials only
      const approvedTestimonials = data.filter(t => t.isApproved === true);
      setTestimonials(approvedTestimonials || []);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      setTestimonials([]);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={18} 
        fill={i < rating ? '#fbbf24' : 'none'} 
        color={i < rating ? '#fbbf24' : '#d1d5db'} 
      />
    ));
  };

  return (
    <div className="home">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="hero">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="hero-background"
            style={{
              backgroundImage: `url(${heroImages[currentImageIndex]})`
            }}
          />
        </AnimatePresence>
        
        <div className="hero-overlay"></div>
        
        {/* Navigation Arrows */}
        <button className="slider-arrow left" onClick={prevImage} aria-label="Previous image">
          <ChevronLeft size={32} />
        </button>
        <button className="slider-arrow right" onClick={nextImage} aria-label="Next image">
          <ChevronRight size={32} />
        </button>

        <div className="container hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            L'Art de la Pierre <br />
            <span className="text-accent">Naturelle</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle"
          >
            Vente de produits décoratifs, pose de pierres, conseils en décoration et rénovation pour sublimer vos espaces.
            Du brut au raffiné, nous façonnons vos projets.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-actions"
          >
            <Link to="/products" className="btn btn-primary">Découvrir nos pierres</Link>
            <Link to="/contact" className="btn hero-btn-outline">Demander un devis</Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Professional */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Notre Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des services complets pour tous vos projets en pierre naturelle
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {expertises.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
                
                {/* Icon/Number */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {item.icon || index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Professional Layout */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-stone-50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Nos Dernières Réalisations
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez comment nos pierres naturelles subliment les espaces de nos clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/project/${project._id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800">
                    {/* Image container */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={project.imageUrl ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${project.imageUrl}`) : '/images/stone-1.png'}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
                          {project.category}
                        </span>
                      </div>

                      {/* Hover icon */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        {project.title}
                      </h3>
                      
                      {project.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                          {project.description}
                        </p>
                      )}

                      {/* View project link */}
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold text-sm group-hover:gap-3 transition-all">
                        <span>Voir le projet</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-1 bg-gradient-to-r from-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/portfolio" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Voir toute la galerie
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Professional Grid Layout */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Avis de Nos Clients
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                La satisfaction de nos clients est notre plus belle récompense
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 relative overflow-hidden group"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-bl-full"></div>
                  
                  {/* Quote icon */}
                  <div className="mb-6">
                    <Quote className="w-12 h-12 text-amber-600 opacity-20" />
                  </div>

                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < testimonial.rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-gray-200 text-gray-200'
                        } transition-all`}
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 italic">
                    "{testimonial.message}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.job || 'Client'}</p>
                    </div>
                  </div>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-50/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>

            {/* View all button if more than 6 testimonials */}
            {testimonials.length > 6 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Voir tous les avis ({testimonials.length})
                </button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Team Section - Professional */}
      {teamPreview.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 via-stone-50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Notre Équipe d'Experts
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Ils mettent leur savoir-faire au service de votre projet
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {teamPreview.map((member, index) => (
                <motion.div 
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-80 overflow-hidden">
                    <motion.img 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={member.imageUrl ? (member.imageUrl.startsWith('http') ? member.imageUrl : `${member.imageUrl}`) : 'https://via.placeholder.com/300?text=Membre'} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-amber-600 dark:text-amber-500 font-semibold text-sm uppercase tracking-wider">
                      {member.role}
                    </p>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link 
                to="/about" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Découvrir toute l'équipe
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Technician Section - Professional */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/dxtyreyse/image/upload/v1769627409/bakaba-static/technician-bakaba.png"
                  alt="M. Bakaba, Maître Artisan" 
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl -z-10"></div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Le Maître Artisan
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-700 mb-6"></div>
                <h3 className="text-2xl font-heading text-amber-600 dark:text-amber-500 mb-6">
                  M. Bakaba
                </h3>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Fondateur et expert passionné, M. Bakaba met son savoir-faire unique au service de vos projets. 
                Avec des années d'expérience dans la taille et la pose de pierre, il garantit une finition irréprochable 
                et une esthétique qui traverse le temps.
              </p>

              <div className="bg-amber-50 dark:bg-slate-800 border-l-4 border-amber-600 p-6 rounded-r-xl">
                <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "Chaque pierre a une histoire, et mon travail est de la raconter à travers votre habitat."
                </p>
              </div>

              <Link 
                to="/contact" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Prendre rendez-vous
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
