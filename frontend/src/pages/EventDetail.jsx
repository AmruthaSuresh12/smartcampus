import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Award, Sparkles, X, ArrowLeft, Camera, Ticket, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [exportingRegistrations, setExportingRegistrations] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    usn: '',
    motivation: ''
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:5005/api/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('campusToken');
    if (!token || !user) {
      navigate('/login');
      return;
    }
    try {
      setRegistering(true);
      const res = await axios.post(`http://localhost:5005/api/events/${id}/register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.qrData) {
        setTicketData(res.data.qrData);
      } else {
        alert('Successfully registered!');
      }
      
      setShowRegForm(false);
      fetchEvent();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const generateAnnouncement = async () => {
    try {
      setGenerating(true);
      setShowAIModal(true);
      const token = localStorage.getItem('campusToken');
      const res = await axios.post(`http://localhost:5005/api/events/${id}/announce`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncement(res.data.announcement);
    } catch (error) {
      alert('Failed to generate announcement');
      setShowAIModal(false);
    } finally {
      setGenerating(false);
    }
  };

  const downloadRegistrations = async () => {
    try {
      setExportingRegistrations(true);
      const token = localStorage.getItem('campusToken');
      const res = await axios.get(`http://localhost:5005/api/events/${id}/registrations/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-${id}-registrations.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to download event registrations', error);
      alert(error.response?.status === 403
        ? 'Only club admins can download registration details.'
        : 'Failed to download registration details.');
    } finally {
      setExportingRegistrations(false);
    }
  };

  const checkTicketAndRegister = async () => {
    const token = localStorage.getItem('campusToken');
    if (!token || !user) {
      navigate('/login');
      return;
    }
    try {
      // Check if user already has a ticket
      const res = await axios.get(`http://localhost:5005/api/events/${id}/ticket`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.qrData) {
        setTicketData(res.data.qrData); // Show digital pass instantly
      }
    } catch (error) {
      // If not found (404), show registration form
      setShowRegForm(true);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white">Loading Event...</div>;
  if (!event) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white">Event Not Found</div>;

  const registrations = event._count?.registrations || 0;
  const capacity = event.capacity || 100;
  const seatsRemaining = Math.max(0, capacity - registrations);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Moderate Dark Blue Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto p-4 md:p-10 relative z-10">
        <Link to="/events" className="inline-flex items-center text-slate-300 hover:text-white font-bold mb-6 transition-colors bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Link>

        {/* Hero Section */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl mb-8">
          <div className="h-72 md:h-96 relative bg-slate-900">
            <img src={event.posters ? event.posters.split(',')[0] : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"} className="w-full h-full object-cover opacity-80" alt="Event Banner" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <span className="inline-block bg-amber-500 text-white px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-widest mb-3 shadow-lg">{event.club.name}</span>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">{event.title}</h1>
              </div>
              <div className="mt-4 md:mt-0 bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl text-white text-center min-w-[140px] shadow-lg">
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Seats Left</p>
                <p className="text-4xl font-black text-amber-500">{seatsRemaining}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-10">
                <section>
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4">About The Event</h3>
                  <p className="text-slate-300 font-medium leading-relaxed text-base whitespace-pre-wrap">{event.description}</p>
                </section>
                
                {/* Winners Gallery */}
                <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-extrabold text-white mb-4 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-amber-500" /> Event Winners
                  </h3>
                  {event.winners ? (
                    <p className="text-slate-300 font-bold text-sm">Winners have been announced! Check back for details.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/80 p-5 rounded-xl border border-white/5 shadow-sm text-center">
                        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto rounded-full flex items-center justify-center mb-3"><Award className="w-7 h-7"/></div>
                        <p className="font-extrabold text-white text-base">Winner 1</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">1st Place</p>
                      </div>
                      <div className="bg-slate-800/80 p-5 rounded-xl border border-white/5 shadow-sm text-center">
                        <div className="w-14 h-14 bg-slate-700 border border-white/10 text-slate-300 mx-auto rounded-full flex items-center justify-center mb-3"><Award className="w-7 h-7"/></div>
                        <p className="font-extrabold text-white text-base">Winner 2</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">2nd Place</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Event Photo Gallery */}
                <section>
                  <h3 className="text-lg font-extrabold text-white mb-4 flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-amber-500" /> Event Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="relative rounded-2xl border border-white/10 shadow-sm aspect-video overflow-hidden">
                        <img 
                          src={event.gallery && event.gallery.split(',')[i] ? event.gallery.split(',')[i] : `https://images.unsplash.com/photo-${['1511578314322-379a950e1391', '1540575467063-178a50c2df87', '1505373877841-8d25f7d46678'][i]}?q=80&w=500`}
                          onError={(e) => e.target.src=`https://images.unsplash.com/photo-${['1511578314322-379a950e1391', '1540575467063-178a50c2df87', '1505373877841-8d25f7d46678'][i]}?q=80&w=500`}
                          className="w-full h-full object-cover opacity-90" 
                          alt="Gallery"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center text-slate-300 mb-6">
                    <div className="w-12 h-12 bg-slate-800 border border-white/5 rounded-xl flex items-center justify-center mr-4 shadow-sm text-amber-500">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Date & Time</p>
                      <p className="font-bold text-white text-base mt-0.5">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-300 mb-6">
                    <div className="w-12 h-12 bg-slate-800 border border-white/5 rounded-xl flex items-center justify-center mr-4 shadow-sm text-amber-500">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Venue</p>
                      <p className="font-bold text-white text-base mt-0.5">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-300 mb-8">
                    <div className="w-12 h-12 bg-slate-800 border border-white/5 rounded-xl flex items-center justify-center mr-4 shadow-sm text-amber-500">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Availability</p>
                      <p className="font-bold text-white text-base mt-0.5">{seatsRemaining} / {capacity} seats</p>
                    </div>
                  </div>

                  <button 
                    onClick={checkTicketAndRegister}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {seatsRemaining === 0 ? 'Fully Booked' : 'Get Event Pass / RSVP'}
                  </button>
                </div>

                {(user?.role === 'SUPER_ADMIN' || user?.role === 'FACULTY' || user?.role === 'CLUB_ADMIN') && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-extrabold text-white mb-2 flex items-center text-base">
                      <Sparkles className="w-5 h-5 mr-2 text-amber-500" /> Admin Tools
                    </h4>
                    <p className="text-sm font-medium text-slate-300 mb-4">Generate a hype-building announcement for WhatsApp or Social Media.</p>
                    <button 
                      onClick={generateAnnouncement}
                      className="w-full bg-slate-800 text-white hover:bg-slate-700 font-extrabold py-3 rounded-xl transition-all shadow-md text-sm flex items-center justify-center border border-white/10"
                    >
                      Generate Post
                    </button>
                    {user?.role === 'CLUB_ADMIN' && (
                      <button
                        onClick={downloadRegistrations}
                        disabled={exportingRegistrations}
                        className="w-full mt-3 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {exportingRegistrations ? 'Preparing Excel...' : 'Download Registrations (.xlsx)'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-800 rounded-[2rem] border border-white/10 p-8 w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setShowAIModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-700 p-2.5 rounded-full"><X className="w-5 h-5"/></button>
              <h2 className="text-2xl font-extrabold mb-2 text-white flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-amber-500" /> AI Generated Post
              </h2>
              <p className="text-sm font-bold text-slate-400 mb-6">Copy this text and share it on your club's social channels.</p>
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 h-64 overflow-y-auto text-sm shadow-inner">
                {generating ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Sparkles className="w-8 h-8 animate-pulse mb-3 text-amber-500/50" />
                    <p className="font-bold animate-pulse">Generating awesomeness...</p>
                  </div>
                ) : (
                  <p className="text-slate-300 font-medium whitespace-pre-wrap">{announcement}</p>
                )}
              </div>
              <button onClick={() => {navigator.clipboard.writeText(announcement); alert("Copied to clipboard!");}} disabled={generating} className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg text-sm disabled:opacity-50">
                Copy to Clipboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showRegForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-800 rounded-[2rem] border border-white/10 p-8 md:p-10 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowRegForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-700 p-2.5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white">Registration</h2>
                <p className="text-slate-400 font-bold text-sm mt-2">Register for {event.title}.</p>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white font-medium outline-none shadow-inner" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest">USN (Seat Number)</label>
                  <input required type="text" value={formData.usn} onChange={e => setFormData({...formData, usn: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white font-medium outline-none uppercase shadow-inner" placeholder="4NI..." />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Why do you want to attend?</label>
                  <textarea required value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white font-medium h-28 resize-none outline-none shadow-inner" placeholder="Briefly explain what you hope to learn..."></textarea>
                </div>
                
                <button type="submit" disabled={registering} className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:transform-none text-base">
                  {registering ? 'Submitting...' : 'Register Now'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Digital Event Pass Modal */}
      <AnimatePresence>
        {ticketData && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 40, opacity: 0 }} 
              className="bg-slate-800/95 border border-white/10 rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center"
            >
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-amber-500/15 to-transparent pointer-events-none" />
              
              <button 
                onClick={() => setTicketData(null)} 
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-700/80 hover:bg-slate-700 p-2 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5"/>
              </button>
              
              {/* Header Badge */}
              <div className="inline-flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 relative z-10">
                <CheckCircle2 className="w-4 h-4" />
                <span>Registration Confirmed</span>
              </div>

              <h2 className="text-2xl font-black text-white mb-1 relative z-10 text-center">Digital Event Pass</h2>
              <p className="text-slate-400 font-semibold mb-6 relative z-10 text-xs text-center">Your seat has been reserved successfully</p>
              
              {/* Event Pass Card */}
              <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-5 relative z-10 shadow-inner space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">{event?.club?.name}</span>
                  <h3 className="text-lg font-black text-white leading-tight mt-0.5">{event?.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Date</p>
                    <p className="text-white font-extrabold mt-0.5">{event?.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Venue</p>
                    <p className="text-white font-extrabold mt-0.5 line-clamp-1">{event?.venue || 'Campus Auditorium'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Attendee</p>
                    <p className="text-white font-extrabold mt-0.5">{user?.name || 'Student'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Status</p>
                    <p className="text-emerald-400 font-extrabold mt-0.5 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active
                    </p>
                  </div>
                </div>

                {/* Reference ID Pill */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Pass Reference ID</p>
                  <p className="text-xs font-mono font-bold text-amber-400 break-all">{ticketData}</p>
                </div>
              </div>

              {/* Points Earned Banner */}
              <div className="mt-5 w-full bg-amber-500/10 border border-amber-500/20 rounded-xl py-2.5 px-4 text-center">
                <p className="text-amber-400 font-black text-xs flex items-center justify-center">
                  <Award className="w-4 h-4 mr-1.5 text-amber-400" /> +50 Campus Engagement Points Earned!
                </p>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setTicketData(null)}
                className="w-full mt-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold py-3 rounded-xl transition-all shadow-lg text-sm"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



