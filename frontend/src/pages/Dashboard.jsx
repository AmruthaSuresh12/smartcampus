import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Book, Briefcase, Award, Settings, LogOut, Code, Calendar, 
  CheckCircle, Clock, Users, X, Camera, Sparkles, ArrowRight, Flame, 
  Trophy, Upload, FileText, CheckCircle2, RefreshCw, AlertCircle, 
  ExternalLink, ChevronRight, FileUp, Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  // Resume & Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [joiningClubId, setJoiningClubId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/resume/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.recommendations) {
        setRecommendations(res.data.recommendations);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchRecommendations();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadMsg(null);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    setUploadMsg(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.post('http://localhost:5005/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data?.success) {
        setUploadMsg(res.data.message || 'Resume processed successfully!');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (res.data.recommendations) {
          setRecommendations(res.data.recommendations);
        }
        // Refresh profile to show updated skills
        fetchProfile();
      }
    } catch (error) {
      console.error("Upload failed", error);
      setUploadError(error.response?.data?.error || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePasteTextSubmit = async () => {
    if (!pastedText.trim()) return;

    setUploading(true);
    setUploadError(null);
    setUploadMsg(null);

    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.post('http://localhost:5005/api/resume/upload', {
        resumeText: pastedText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setUploadMsg(res.data.message || 'Skills extracted successfully!');
        setPastedText('');
        setShowPasteModal(false);
        if (res.data.recommendations) {
          setRecommendations(res.data.recommendations);
        }
        fetchProfile();
      }
    } catch (error) {
      console.error("Text analysis failed", error);
      setUploadError(error.response?.data?.error || 'Failed to analyze text.');
    } finally {
      setUploading(false);
    }
  };

  const handleQuickJoin = async (clubId) => {
    try {
      setJoiningClubId(clubId);
      const token = localStorage.getItem('campusToken');
      await axios.post(`http://localhost:5005/api/clubs/${clubId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Join request submitted successfully!');
      fetchProfile();
      fetchRecommendations();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to join club');
    } finally {
      setJoiningClubId(null);
    }
  };

  const getMembershipStatus = (clubId) => {
    const membership = profile?.clubMemberships?.find(m => m.clubId === clubId);
    return membership ? membership.status : null;
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white flex font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Moderate Dark Blue Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md pointer-events-none z-0" />
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-72 bg-slate-800/60 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col shadow-xl z-10 relative"
      >
        <div className="flex items-center space-x-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <User className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">SmartCampus</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/dashboard" icon={<User className="w-5 h-5"/>} label="Profile" active={location.pathname === '/dashboard'} />
          <a 
            href="#resume-scanner" 
            className="flex items-center space-x-4 p-3.5 rounded-xl transition-all font-bold text-sm text-amber-400 hover:bg-slate-700/60 bg-amber-500/10 border border-amber-500/20"
          >
            <FileUp className="w-5 h-5 text-amber-400" />
            <span>Upload Resume</span>
          </a>
          <NavItem to="/clubs" icon={<Briefcase className="w-5 h-5"/>} label="Clubs" active={location.pathname === '/clubs'} />
          <NavItem to="/events" icon={<Award className="w-5 h-5"/>} label="Events" active={location.pathname === '/events'} />
          <NavItem to="/leaderboard" icon={<Trophy className="w-5 h-5"/>} label="Leaderboard" active={location.pathname === '/leaderboard'} />
          <NavItem to="/bookings" icon={<Calendar className="w-5 h-5"/>} label="Book Auditoriums" active={location.pathname === '/bookings'} />
          {user?.role === 'SUPER_ADMIN' || user?.role === 'FACULTY' || user?.role === 'CLUB_ADMIN' ? (
            <div className="pt-6 pb-2">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Moderation</p>
              <NavItem to="/admin/bookings" icon={<CheckCircle className="w-5 h-5"/>} label="Manage Bookings" active={location.pathname === '/admin/bookings'} />
              <NavItem to="/admin/clubs" icon={<Users className="w-5 h-5"/>} label="Club Requests" active={location.pathname === '/admin/clubs'} />
              {user?.role === 'SUPER_ADMIN' && (
                <NavItem to="/admin/super" icon={<Settings className="w-5 h-5"/>} label="Super Admin" active={location.pathname === '/admin/super'} />
              )}
            </div>
          ) : null}
        </nav>

        <button onClick={logout} className="flex items-center space-x-3 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 p-3.5 rounded-xl transition-all shadow-sm w-full font-bold">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 relative z-10 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Welcome back, {user?.name} 👋</h1>
              <p className="text-slate-300 mt-2 text-lg font-bold drop-shadow-sm">Here is what's happening on campus today.</p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="#resume-scanner"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold px-5 py-3 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload Resume</span>
              </a>
              <button onClick={() => setIsEditing(true)} className="hidden md:flex bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 text-white border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </header>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mb-8 relative overflow-hidden shadow-xl"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 rounded-[1.5rem] bg-slate-700 border-4 border-slate-600 shadow-xl flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-white">{profile?.name || user?.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-slate-300 text-sm font-bold">
                    <span className="flex items-center space-x-1.5 bg-slate-900/50 px-4 py-2 rounded-xl shadow-sm border border-white/5">
                      <Book className="w-4 h-4 text-amber-500"/> <span>{profile?.department || 'Computer Science'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-slate-900/50 px-4 py-2 rounded-xl shadow-sm border border-white/5 uppercase">
                      <Award className="w-4 h-4 text-amber-500"/> <span>{user?.role}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl shadow-sm border border-amber-500/20">
                      <Flame className="w-4 h-4"/> <span className="font-black">{profile?.points || 0} PTS</span>
                    </span>
                  </div>
                  <p className="mt-5 text-sm md:text-base max-w-2xl leading-relaxed text-slate-300 font-medium">
                    {profile?.bio || "Passionate engineering student looking to collaborate on open-source projects and join technical clubs."}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="mt-8 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-500" /> Your Verified Skills
                </p>
                <span className="text-[11px] font-semibold text-amber-400/80">
                  {profile?.skills ? profile.skills.split(',').length : 0} skills detected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile?.skills ? profile.skills.split(',') : ['React.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS']).map((skill, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm rounded-xl text-xs font-bold flex items-center space-x-1.5 text-slate-200 hover:border-amber-500/40 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{skill.trim()}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {user?.role !== 'FACULTY' && user?.role !== 'SUPER_ADMIN' ? (
            <>
              {/* RESUME UPLOAD & SKILL EXTRACTION SECTION */}
              <motion.div 
                id="resume-scanner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-8 bg-gradient-to-br from-slate-800/80 via-slate-800/50 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden scroll-mt-8"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-white">Smart Resume Scanner & Club Matcher</h2>
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          AI Engine
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 font-medium mt-1 max-w-xl">
                        Upload your resume (PDF or TXT) to automatically extract your tech stack, programming languages, and tools. Our matching engine will align your skills with campus clubs!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                      onClick={() => setShowPasteModal(true)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900/50 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Paste Text Instead</span>
                    </button>
                    <button
                      onClick={fetchRecommendations}
                      disabled={loadingRecs}
                      className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900/50 text-slate-300 hover:text-white transition-all shadow-sm"
                      title="Refresh recommendations"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingRecs ? 'animate-spin text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Upload Action Area */}
                <div className="relative z-10 bg-slate-900/60 border border-dashed border-white/15 rounded-2xl p-6 hover:border-amber-500/40 transition-all">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".pdf,.txt" 
                        className="hidden" 
                        id="resume-file-input" 
                      />
                      <label 
                        htmlFor="resume-file-input"
                        className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-white/10 px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Choose Resume File</span>
                      </label>
                      
                      {selectedFile ? (
                        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-white/10">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white max-w-[200px] truncate">{selectedFile.name}</span>
                          <span className="text-[10px] text-slate-400">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Supports PDF or TXT (Max 10MB)</span>
                      )}
                    </div>

                    <button
                      onClick={handleUploadResume}
                      disabled={!selectedFile || uploading}
                      className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs px-7 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Extracting Skills...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Extract Skills & Match Clubs</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Feedback Banners */}
                  {uploadMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{uploadMsg}</span>
                    </motion.div>
                  )}

                  {uploadError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="mt-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* DYNAMIC SMART CLUB RECOMMENDATIONS */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-amber-500 mr-4 shadow-md border border-white/5">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-white">Recommended Clubs For You</h2>
                      <p className="text-sm text-slate-300 font-bold mt-0.5">
                        Ranked dynamically based on your extracted resume tech stack
                      </p>
                    </div>
                  </div>

                  <Link 
                    to="/clubs" 
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
                  >
                    <span>Explore All Clubs</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {loadingRecs ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-sm font-medium">
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                    <span>Analyzing your skill profile & computing match scores...</span>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    No recommendations found yet. Upload a resume to see matching clubs!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {recommendations.slice(0, 6).map(({ club, matchScore, matchedSkills, reason }) => {
                      const membershipStatus = getMembershipStatus(club.id);
                      const isHighMatch = matchScore >= 80;
                      const isMediumMatch = matchScore >= 65 && matchScore < 80;

                      return (
                        <div 
                          key={club.id} 
                          className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            {/* Card Header with Score */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {club.logo ? (
                                  <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-black text-amber-400 text-lg">{club.name.charAt(0)}</span>
                                )}
                              </div>

                              {/* Match Score Badge */}
                              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border flex items-center gap-1 ${
                                isHighMatch 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                  : isMediumMatch 
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              }`}>
                                <Zap className="w-3 h-3" />
                                {matchScore}% Match
                              </span>
                            </div>

                            {/* Club Name & Description */}
                            <h4 className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                              {club.name}
                            </h4>
                            <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2 leading-relaxed">
                              {club.description}
                            </p>

                            {/* Why it matches */}
                            <p className="text-[11px] text-amber-300/90 font-semibold mt-3 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/15">
                              {reason}
                            </p>

                            {/* Matched Skill Tags */}
                            {matchedSkills && matchedSkills.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {matchedSkills.slice(0, 4).map((s, idx) => (
                                  <span key={idx} className="bg-slate-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/5">
                                    {s}
                                  </span>
                                ))}
                                {matchedSkills.length > 4 && (
                                  <span className="text-[10px] text-slate-400 font-semibold self-center">
                                    +{matchedSkills.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Card Footer Actions */}
                          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                            <Link 
                              to={`/clubs/${club.id}`}
                              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                            >
                              <span>Details</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>

                            {membershipStatus === 'APPROVED' ? (
                              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Joined
                              </span>
                            ) : membershipStatus === 'PENDING' ? (
                              <span className="text-amber-400 text-xs font-bold bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30">
                                Pending
                              </span>
                            ) : (
                              <button
                                onClick={() => handleQuickJoin(club.id)}
                                disabled={joiningClubId === club.id}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                              >
                                {joiningClubId === club.id ? 'Joining...' : 'Join Club'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <BentoCard title="Joined Clubs" count={profile?.clubMemberships?.filter(m => m.status === 'APPROVED')?.length || 0} icon={<Briefcase className="w-7 h-7"/>} />
                <BentoCard title="Active Bookings" count={profile?.bookings?.length || 0} icon={<Calendar className="w-7 h-7"/>} />
                <BentoCard title="Upcoming Events" count={profile?.eventRegistrations?.length || 0} icon={<Award className="w-7 h-7"/>} />
              </div>

              {/* My Bookings Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-extrabold flex items-center text-white">
                    <Calendar className="w-6 h-6 mr-3 text-amber-500" /> My Booking Requests
                  </h2>
                  <Link to="/bookings" className="text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    + New Booking
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {profile?.bookings?.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-amber-500/30 hover:bg-slate-800 transition-all group">
                      <div className="flex items-center space-x-5">
                        <div className="w-12 h-12 rounded-[1rem] bg-slate-800 border border-white/5 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{booking.auditorium.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{new Date(booking.date).toLocaleDateString()} • {booking.timeSlot}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                        booking.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                        booking.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                  {(!profile?.bookings || profile.bookings.length === 0) && (
                    <div className="text-center py-8 text-slate-400 font-medium text-xs">
                      No active auditorium booking requests found.
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          ) : null}
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <EditProfileModal 
            profile={profile} 
            onClose={() => setIsEditing(false)} 
            onUpdate={() => {
              fetchProfile();
              fetchRecommendations();
            }} 
          />
        )}
      </AnimatePresence>

      {/* Paste Text Modal */}
      <AnimatePresence>
        {showPasteModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-800 rounded-[2rem] border border-white/10 p-8 w-full max-w-xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPasteModal(false)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-700 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-white flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Paste Resume Text</span>
              </h2>
              <p className="text-xs text-slate-300 mb-4 font-medium">
                Copy and paste your resume content, project summaries, or technical skills below.
              </p>

              <textarea
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="e.g. Full stack developer experienced in React, Node.js, Express, PostgreSQL, Docker, AWS, and Git..."
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 h-48 focus:ring-2 focus:ring-amber-500/50 outline-none resize-none font-mono"
              />

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasteTextSubmit}
                  disabled={!pastedText.trim() || uploading}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg disabled:opacity-40 flex items-center gap-2"
                >
                  {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Analyze & Extract</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditProfileModal({ profile, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    department: profile?.department || '',
    skills: profile?.skills || '',
    avatar: profile?.avatar || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('campusToken');
      await axios.put('http://localhost:5005/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-slate-800 rounded-[2rem] border border-white/10 p-8 w-full max-w-lg shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-700 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-white">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-[1rem] bg-slate-900 border border-white/10 overflow-hidden relative group">
              {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Avatar URL</label>
            <input type="text" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Department</label>
              <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Bio</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm h-24 resize-none font-medium outline-none" placeholder="Tell us about yourself..."></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Skills (Comma Separated)</label>
            <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" placeholder="React, Node.js, Design" />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-white hover:bg-slate-200 text-slate-900 rounded-xl py-3.5 text-sm font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-4">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} className={`flex items-center space-x-4 p-3.5 rounded-xl transition-all font-bold text-sm ${active ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function BentoCard({ title, count, icon }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer shadow-xl transition-all"
    >
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="w-12 h-12 bg-slate-700 rounded-2xl text-slate-300 border border-white/5 flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-4xl font-black mb-2 relative z-10 text-white">{count}</h3>
      <p className="text-slate-300 font-bold relative z-10">{title}</p>
    </motion.div>
  );
}
