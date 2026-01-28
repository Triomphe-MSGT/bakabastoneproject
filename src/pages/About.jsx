import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Award, Shield, CheckCircle, ArrowRight, Instagram, Linkedin, Mail } from 'lucide-react';
import Section from '../components/ui/Section';
import './About.css';
import teamService from '../services/teamService';
import settingsService from '../services/settingsService';

const About = () => {
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState({
    aboutImageUrl: '',
    aboutText: ''
  });
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamData, settingsData] = await Promise.all([
        teamService.getAllTeamMembers(),
        settingsService.getSettings()
      ]);
      setTeam(teamData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const aboutTextFallback = `
    Fondée par M. Bakaba, expert passionné, notre entreprise a su évoluer 
    tout en conservant les techniques artisanales qui font la noblesse de notre métier.
    Aujourd'hui, nous allions savoir-faire technique et créativité pour offrir à nos clients 
    des solutions complètes : vente de produits décoratifs, pose, décoration et rénovation.
  `;

  const aboutImageFallback = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000";

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return BASE_URL + imageUrl;
  };

  return (
    <div className="about-page min-h-screen transition-colors duration-300 bg-white dark:bg-slate-900">
      <div className="page-header relative overflow-hidden">
        {/* Background decoration for header */}
        <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-6"
          >
            Notre Histoire
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
            Une passion pour la pierre transmise au service de l'excellence architecturale.
          </motion.p>
        </div>
      </div>

      <Section className="!py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-sm font-semibold tracking-wide uppercase">
              <Award size={16} /> L'Excellence Bakaba
            </div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-1000 dark:text leading-tight">
              L'Art de transformer la matière en <span className="text-amber-600 dark:text-amber-500">Patrimoine</span>.
            </h2>
            
            <p className="text-lg text-gray-2000 dark:text-gray-1000 leading-relaxed font-medium">
              {settings.aboutText || aboutTextFallback}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-gray-100 dark:border-slate-800">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-amber-600 mb-1">35+</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Années</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-amber-600 mb-1">500+</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Réalisations</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-amber-600 mb-1">15</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Experts</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10 aspect-[4/5]">
              <img 
                src={getImageSrc(settings.aboutImageUrl) || aboutImageFallback} 
                alt="A propos de nous" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-amber-500/30 rounded-2xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -z-0"></div>
          </motion.div>
        </div>
      </Section>

      {team.length > 0 && (
        <Section className="!py-24 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
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
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Des maîtres artisans et techniciens dévoués pour transformer vos espaces avec la beauté intemporelle de la pierre.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 relative">
                    {/* Member Image */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={getImageSrc(member.imageUrl)} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Social Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-10 group-hover:translate-y-0">
                         <button className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all shadow-lg">
                           <Linkedin size={18} />
                         </button>
                         <button className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all shadow-lg">
                           <Instagram size={18} />
                         </button>
                         <button className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all shadow-lg">
                           <Mail size={18} />
                         </button>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-amber-600 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-4">
                        {member.role}
                      </p>
                      {member.bio && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 italic">
                          "{member.bio}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Decorative Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};

export default About;

