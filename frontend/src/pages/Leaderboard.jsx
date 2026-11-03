import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, User, ArrowLeft, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/users/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaders(res.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-slate-500">Loading Leaderboard...</div>;

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white flex flex-col font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Moderate Dark Blue Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md pointer-events-none z-0" />

      <main className="flex-1 p-6 md:p-12 relative z-10 overflow-y-auto w-full max-w-5xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-slate-300 hover:text-white font-bold mb-8 transition-colors bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/80 border border-white/10 text-amber-500 rounded-2xl mb-6 shadow-md backdrop-blur-md">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-md">
            Campus Leaderboard
          </h1>
          <p className="text-slate-300 text-base font-bold max-w-2xl mx-auto drop-shadow-sm">
            Top students ranked by campus engagement. Earn points by joining clubs and registering for events.
          </p>
        </header>

        {/* Top 3 Podium */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20 mt-10">
          {/* Rank 2 - Silver */}
          {leaders[1] && (
            <PodiumCard user={leaders[1]} rank={2} color="slate" height="h-40" />
          )}
          {/* Rank 1 - Gold */}
          {leaders[0] && (
            <PodiumCard user={leaders[0]} rank={1} color="amber" height="h-56" />
          )}
          {/* Rank 3 - Bronze */}
          {leaders[2] && (
            <PodiumCard user={leaders[2]} rank={3} color="orange" height="h-32" />
          )}
        </div>

        {/* Remaining List */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {leaders.slice(3).map((user, index) => (
            <div 
              key={user.id}
              className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center space-x-5">
                <div className="w-10 font-black text-xl text-slate-400 text-right">
                  #{index + 4}
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden flex items-center justify-center shadow-inner">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{user.name}</h3>
                  <p className="text-slate-400 text-xs font-bold mt-0.5">{user.department || 'Campus Student'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 shadow-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="font-black text-amber-500 text-base">{user.points} <span className="text-[10px] text-amber-500/70 uppercase tracking-widest font-bold">PTS</span></span>
              </div>
            </div>
          ))}
        </div>
        
        {leaders.length === 0 && (
          <div className="text-center text-slate-400 font-bold p-10 bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-500" />
            No campus activity recorded yet.
          </div>
        )}
      </main>
    </div>
  );
}

function PodiumCard({ user, rank, color, height }) {
  const colorMap = {
    amber: { bg: 'bg-slate-800/80', text: 'text-amber-500', border: 'border-amber-500/50', textD: 'text-amber-500', crown: true },
    slate: { bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-500/50', textD: 'text-slate-300', crown: false },
    orange: { bg: 'bg-slate-800/60', text: 'text-orange-500', border: 'border-orange-500/50', textD: 'text-orange-500', crown: false }
  };
  const theme = colorMap[color];

  return (
    <div className={`relative flex flex-col items-center w-full md:w-56`}>
      <div className="relative mb-6 z-10 flex flex-col items-center">
        {theme.crown && <Crown className="w-8 h-8 text-amber-400 absolute -top-10 drop-shadow-md" />}
        <div className={`w-24 h-24 rounded-full bg-slate-700 border-4 ${theme.border} flex items-center justify-center overflow-hidden relative z-10 shadow-xl`}>
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-slate-400" />}
        </div>
        <div className={`absolute -bottom-3 bg-slate-800 border-2 ${theme.border} ${theme.textD} w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-md z-20`}>
          {rank}
        </div>
      </div>
      
      <div className={`w-full ${theme.bg} backdrop-blur-xl border-t border-x border-white/10 rounded-t-3xl ${height} flex flex-col items-center pt-8 pb-4 px-4 text-center shadow-lg`}>
        <h3 className="font-extrabold text-white text-base truncate w-full drop-shadow-sm">{user.name}</h3>
        <p className="text-slate-400 text-xs font-bold mt-1 mb-auto truncate w-full">{user.department || 'Student'}</p>
        
        <div className="flex items-center space-x-1 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5 mt-3 shadow-inner">
          <Star className={`w-3.5 h-3.5 ${theme.text}`} />
          <span className="font-black text-white text-sm">{user.points}</span>
        </div>
      </div>
    </div>
  );
}






