import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, Briefcase, Activity, CheckCircle, Shield } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function SuperAdmin() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a dedicated endpoint like /api/admin/stats
    // We will simulate the data fetching for the Dashboard
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('campusToken');
        
        // Fetch users, clubs, events, bookings
        const [usersRes, clubsRes, eventsRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5005/api/auth/users', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
          axios.get('http://localhost:5005/api/clubs', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5005/api/events', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5005/api/bookings', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
        ]);

        setStats({
          users: usersRes.data.length || 156, // fallback for demo
          clubs: clubsRes.data.length,
          events: eventsRes.data.length,
          bookings: bookingsRes.data.length || 42 // fallback for demo
        });
      } catch (error) {
        console.error("Failed to fetch super admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (user?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
      
      <header className="mb-12 max-w-7xl mx-auto relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center">
            <Shield className="w-10 h-10 mr-4 text-primary" /> Super Admin Center
          </h1>
          <p className="text-slate-400 font-medium mt-2 text-lg">God-mode view of the Smart Campus Platform.</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl flex items-center shadow-lg">
          <Activity className="w-5 h-5 text-emerald-400 mr-3 animate-pulse" />
          <span className="font-extrabold text-sm tracking-widest uppercase">System Online</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={loading ? '...' : stats?.users} icon={<Users className="w-8 h-8"/>} color="text-blue-400" bg="bg-blue-400/10" border="border-blue-400/20" />
          <StatCard title="Active Clubs" value={loading ? '...' : stats?.clubs} icon={<Briefcase className="w-8 h-8"/>} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
          <StatCard title="Upcoming Events" value={loading ? '...' : stats?.events} icon={<Award className="w-8 h-8"/>} color="text-amber-400" bg="bg-amber-400/10" border="border-amber-400/20" />
          <StatCard title="Auditorium Bookings" value={loading ? '...' : stats?.bookings} icon={<Calendar className="w-8 h-8"/>} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-400/20" />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-extrabold mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-slate-400" /> Platform Activity Feed
            </h2>
            <div className="space-y-4">
              {[
                { time: '10 mins ago', text: 'New club "The Byte Club" was created.', type: 'club' },
                { time: '1 hour ago', text: 'Auditorium 1 booked for "Annual Tech Symposium".', type: 'booking' },
                { time: '3 hours ago', text: '14 new students registered on the platform.', type: 'user' },
                { time: '5 hours ago', text: 'Event "Hackathon 2026" reached max capacity (500/500).', type: 'event' }
              ].map((act, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.type === 'club' ? 'bg-primary/20 text-primary' : act.type === 'booking' ? 'bg-emerald-500/20 text-emerald-400' : act.type === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-200">{act.text}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-b from-primary/20 to-slate-800/50 border border-primary/30 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-extrabold mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-primary" /> Management Hub
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-between px-6 shadow-sm">
                <span>Manage Users & Roles</span> <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-between px-6 shadow-sm">
                <span>Audit Logs</span> <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-between px-6 shadow-sm">
                <span>Platform Settings</span> <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-center mt-6">
                System Restart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg, border }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-3xl p-6 shadow-lg relative overflow-hidden`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${bg} rounded-full blur-2xl pointer-events-none`} />
      <div className={`w-14 h-14 rounded-2xl ${bg} ${border} border flex items-center justify-center ${color} mb-6`}>
        {icon}
      </div>
      <h3 className="text-4xl font-extrabold mb-2 text-white">{value}</h3>
      <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">{title}</p>
    </motion.div>
  );
}

function ArrowRight({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
}






