import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowLeft, Briefcase, Check, Camera, MapPin, UserCheck, Compass, Target, Sparkles } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function ClubDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState('');

  useEffect(() => {
    fetchClub();
  }, [id]);

  const fetchClub = async () => {
    try {
      const res = await axios.get(`http://localhost:5005/api/clubs/${id}`);
      setClub(res.data);
      if (user) {
        const membership = res.data.members?.find(m => m.userId === user.id);
        if (membership) setJoinStatus(membership.status);
      }
    } catch (error) {
      console.error("Failed to fetch club", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      alert('Please log in to join this club.');
      return;
    }
    try {
      setJoinStatus('loading');
      const token = localStorage.getItem('campusToken');
      await axios.post(`http://localhost:5005/api/clubs/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoinStatus('PENDING');
      alert('Join request submitted! The faculty/club lead will review your application.');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send join request');
      setJoinStatus('');
    }
  };

  const parseMeta = (socialLinks) => {
    try {
      return JSON.parse(socialLinks || '{}');
    } catch (e) {
      return {};
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white">Loading Club Details...</div>;
  if (!club) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-bold text-xl">Club not found.</div>;

  const meta = parseMeta(club.socialLinks);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Dark Glass Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-none z-0" />

      {/* Hero Banner */}
      <div className="h-96 w-full relative z-10 border-b border-white/10 overflow-hidden">
        <img 
          src={club.banner || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000"} 
          className="w-full h-full object-cover opacity-80" 
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        <Link 
          to="/clubs" 
          className="absolute top-8 left-8 text-white bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg hover:bg-slate-800 transition-all flex items-center text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clubs
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative -mt-36 z-20 pb-20">
        {/* Profile Card Header */}
        <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 md:w-36 md:h-36 bg-slate-900 rounded-3xl border-2 border-white/15 shadow-xl overflow-hidden flex-shrink-0 p-1">
              {club.logo ? (
                <img src={club.logo} className="w-full h-full object-cover rounded-2xl" alt="Logo" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center font-black text-4xl text-amber-500">
                  {club.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {meta.campus && (
                  <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {meta.campus}
                  </span>
                )}
                <span className="bg-slate-700/60 border border-white/10 text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-amber-500" /> {club.members?.filter(m => m.status === 'APPROVED').length || 0} Members
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">{club.name}</h1>
              {meta.motto && (
                <p className="text-amber-400 font-semibold italic text-sm md:text-base">"{meta.motto}"</p>
              )}
            </div>
            
            <div className="self-stretch md:self-center flex items-center">
              {joinStatus === 'APPROVED' ? (
                <button disabled className="w-full md:w-auto bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center shadow-sm">
                  <Check className="w-5 h-5 mr-2" /> Member
                </button>
              ) : joinStatus === 'PENDING' ? (
                <button disabled className="w-full md:w-auto bg-amber-500/20 text-amber-400 border border-amber-500/30 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center shadow-sm">
                  Request Pending...
                </button>
              ) : (
                <button 
                  onClick={handleJoin}
                  disabled={joinStatus === 'loading'}
                  className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 py-3.5 rounded-xl font-extrabold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50"
                >
                  {joinStatus === 'loading' ? 'Sending...' : 'Join Club'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Statement from PDF */}
            {meta.mission && (
              <section className="bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                <h2 className="text-xl font-black mb-3 text-white flex items-center">
                  <Target className="w-5 h-5 mr-2.5 text-amber-500" /> Strategic Mission
                </h2>
                <p className="text-slate-300 font-medium leading-relaxed text-sm md:text-base">
                  {meta.mission}
                </p>
              </section>
            )}

            {/* About & Domain */}
            <section className="bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-black mb-3 text-white flex items-center">
                <Compass className="w-5 h-5 mr-2.5 text-amber-500" /> Focus Domain & Scope
              </h2>
              <p className="text-slate-300 font-medium leading-relaxed text-sm mb-4">
                {club.description}
              </p>
              {meta.domain && (
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Key Disciplines</p>
                  <p className="text-amber-400 text-xs font-bold leading-normal">{meta.domain}</p>
                </div>
              )}
            </section>

            {/* Signature Initiatives from PDF */}
            {meta.initiatives && meta.initiatives.length > 0 && (
              <section className="bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                <h2 className="text-xl font-black mb-6 text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2.5 text-amber-500" /> Key Agenda & Signature Initiatives
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meta.initiatives.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/70 border border-white/5 rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                      </div>
                      <p className="text-slate-300 text-xs font-medium leading-relaxed pl-8">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Events */}
            <section className="bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-black mb-6 flex items-center text-white">
                <Calendar className="w-5 h-5 mr-2.5 text-amber-500" /> Upcoming Club Events
              </h2>
              {club.events?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {club.events.map(event => (
                    <Link key={event.id} to={`/events/${event.id}`} className="bg-slate-900/70 border border-white/5 rounded-2xl p-6 hover:border-amber-500/40 hover:shadow-xl transition-all block group">
                      <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">{event.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1 mb-4 line-clamp-2">{event.description}</p>
                      <div className="text-xs font-bold text-amber-400 bg-amber-500/10 inline-block px-3 py-1.5 rounded-lg border border-amber-500/20">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                  <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 font-medium text-xs">No upcoming events scheduled at the moment.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Leadership Info from PDF */}
            <div className="bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Faculty Coordinator */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                  Faculty Leadership
                </h3>
                <div className="flex items-center space-x-3 bg-slate-900/60 p-3.5 rounded-2xl border border-white/5">
                  <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 font-black shadow-sm flex-shrink-0">
                    {club.facultyCoordinator?.name ? club.facultyCoordinator.name.charAt(0) : 'F'}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-white">{club.facultyCoordinator?.name || 'Faculty Lead'}</p>
                    <p className="text-xs text-slate-400">{club.facultyCoordinator?.bio || club.facultyCoordinator?.email || 'Faculty Coordinator'}</p>
                  </div>
                </div>
              </div>

              {/* Student Lead */}
              {meta.studentLead && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                    Student Leadership
                  </h3>
                  <div className="flex items-center space-x-3 bg-slate-900/60 p-3.5 rounded-2xl border border-white/5">
                    <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black shadow-sm flex-shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-white">{meta.studentLead}</p>
                      <p className="text-xs text-slate-400">Student Coordinator</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Open Positions */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-4 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Recruitment & Openings
              </h3>
              {club.openings?.length > 0 ? (
                <div className="space-y-3">
                  {club.openings.map(opening => (
                    <div key={opening.id} className="bg-slate-900/80 p-4 rounded-xl border border-white/5 shadow-sm">
                      <h4 className="font-bold text-sm text-white">{opening.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opening.description}</p>
                      <button className="text-xs mt-3 text-amber-400 font-bold hover:underline">Apply for Role &rarr;</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium">Recruitment will open during the next campus cycle. Join the club to get updates!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






