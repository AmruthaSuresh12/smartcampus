import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Users } from 'lucide-react';

export default function AdminClubs() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/clubs/requests/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      const token = localStorage.getItem('campusToken');
      await axios.put(`http://localhost:5005/api/clubs/requests/${requestId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (error) {
      alert('Failed to update request');
    }
  };

  if (user?.role !== 'FACULTY' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'CLUB_ADMIN') {
    return <div className="p-10 text-center text-red-500 min-h-screen bg-[#FAFAFA]">Access Denied. Moderation only.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-900 flex items-center">
          <Users className="w-8 h-8 mr-3 text-primary" /> Manage Club Requests
        </h1>
        
        {loading ? <p>Loading...</p> : (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 font-bold">Student Name</th>
                  <th className="p-4 font-bold">Club</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No pending requests found.</td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{req.user.name} <br/><span className="text-xs font-medium text-slate-500">{req.user.email}</span></td>
                      <td className="p-4 text-slate-600 font-medium">{req.club.name}</td>
                      <td className="p-4"><span className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-lg text-xs font-bold">{req.status}</span></td>
                      <td className="p-4 flex space-x-2">
                        <button onClick={() => handleAction(req.id, 'APPROVED')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleAction(req.id, 'REJECTED')} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}






