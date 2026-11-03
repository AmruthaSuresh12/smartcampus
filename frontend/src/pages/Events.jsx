import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Events() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white">Loading Events...</div>;

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
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">Campus Events</h1>
              <p className="text-slate-300 text-lg font-bold drop-shadow-sm">Discover technical workshops, hackathons, and cultural fests.</p>
            </div>
            
            {(user?.role === 'CLUB_ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <div className="mt-6 md:mt-0">
                <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-extrabold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center">
                  + Create Event
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/events/${event.id}`}
                className="bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full"
              >
                <div className="h-48 relative bg-slate-900 overflow-hidden border-b border-white/10">
                  <img 
                    src={event.posters ? event.posters.split(',')[0] : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"} 
                    onError={(e) => e.target.src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                    alt={event.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-4 left-4 flex flex-col items-center justify-center w-14 h-14 bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-black leading-none text-white">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    {event.club.logo ? (
                      <img src={event.club.logo} className="w-8 h-8 rounded-xl object-cover shadow-sm border border-white/10" alt="Club Logo" />
                    ) : (
                      <div className="w-8 h-8 bg-slate-700 rounded-xl flex items-center justify-center text-xs font-bold text-slate-300 border border-white/5 shadow-sm">
                        C
                      </div>
                    )}
                    <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">{event.club.name}</span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-white mb-3 line-clamp-1">{event.title}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{event.description}</p>
                  
                  <div className="mt-auto space-y-3 mb-8">
                    <div className="flex items-center text-xs font-bold text-slate-300 bg-slate-900/50 px-3 py-2 rounded-xl border border-white/5">
                      <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                      {event.venue || 'TBD'}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-300 bg-slate-900/50 px-3 py-2 rounded-xl border border-white/5">
                      <Users className="w-4 h-4 mr-2 text-amber-500" />
                      Limited to {event.capacity || 100} seats
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                    <span className="text-sm font-extrabold text-white group-hover:text-amber-500 transition-colors">View Details</span>
                    <div className="w-8 h-8 bg-slate-700 group-hover:bg-amber-500 text-white rounded-full flex items-center justify-center transition-all">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}






