import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Code, ArrowRight, ArrowLeft, MapPin, UserCheck, Sparkles } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Clubs() {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/clubs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClubs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const parseMeta = (socialLinks) => {
    try {
      return JSON.parse(socialLinks || '{}');
    } catch (e) {
      return {};
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white">Loading Clubs...</div>;

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Moderate Dark Blue Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <header className="mb-12">
          <Link to="/dashboard" className="text-slate-300 hover:text-white font-bold mb-4 inline-flex items-center transition-colors text-sm bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The National Institute of Engineering</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">Campus Clubs & Organizations</h1>
              <p className="text-slate-300 text-base md:text-lg font-medium drop-shadow-sm">Official directory of recognized student chapters, technical societies, and cultural forums.</p>
            </div>
            
            {user?.role === 'SUPER_ADMIN' && (
              <div className="mt-6 md:mt-0">
                <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-extrabold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center">
                  + Create Club
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Resume Match Callout Banner */}
        <div className="mb-10 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-800/60 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Not sure which club matches your skill set?</h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Upload your resume on the Dashboard to get ranked recommendations with match percentages!</p>
            </div>
          </div>
          <Link
            to="/dashboard#resume-scanner"
            className="bg-white hover:bg-slate-200 text-slate-900 font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex-shrink-0 flex items-center gap-1.5"
          >
            <span>Upload Resume & Match</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club, index) => {
            const meta = parseMeta(club.socialLinks);
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link 
                  to={`/clubs/${club.id}`}
                  className="bg-slate-800/75 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full"
                >
                  <div className="h-44 relative bg-slate-900 overflow-hidden border-b border-white/10">
                    <img 
                      src={club.banner ? club.banner : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200"} 
                      onError={(e) => e.target.src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                      alt={`${club.name} banner`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent pointer-events-none" />
                    
                    {meta.campus && (
                      <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-200 border border-white/10 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-amber-500" />
                        {meta.campus}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-7 relative flex-1 flex flex-col z-10">
                    <div className="absolute -top-12 left-6">
                      <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-white/15 p-1 shadow-xl flex items-center justify-center overflow-hidden backdrop-blur-md">
                        {club.logo ? (
                          <img src={club.logo} className="w-full h-full object-cover rounded-xl" alt="Logo" />
                        ) : (
                          <Code className="w-10 h-10 text-amber-500" />
                        )}
                      </div>
                    </div>

                    <div className="mt-9 mb-2">
                      <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">{club.name}</h3>
                      {meta.motto && (
                        <p className="text-amber-400/90 text-xs italic font-medium mt-1 line-clamp-1">"{meta.motto}"</p>
                      )}
                    </div>
                    
                    <p className="text-slate-300 text-xs font-medium mb-5 line-clamp-2 leading-relaxed">{club.description}</p>
                    
                    {meta.studentLead && (
                      <div className="mb-4 bg-slate-900/50 rounded-xl p-2.5 border border-white/5 flex items-center text-xs text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 mr-2 text-amber-500 flex-shrink-0" />
                        <span className="truncate"><strong className="text-slate-400">Lead:</strong> {meta.studentLead}</span>
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center text-xs font-bold text-slate-300 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-xl shadow-sm">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                        {club._count?.members || 0} Members
                      </div>
                      
                      <span className="text-xs font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center">
                        Explore <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}






