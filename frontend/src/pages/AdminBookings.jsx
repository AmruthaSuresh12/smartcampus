import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('campusToken');
      await axios.put(`http://localhost:5005/api/bookings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (user?.role !== 'FACULTY' && user?.role !== 'SUPER_ADMIN') {
    return <div className="p-10 text-center text-red-500 min-h-screen bg-[#030303]">Access Denied. Staff only.</div>;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Booking Requests</h1>
        
        {loading ? <p>Loading...</p> : (
          <div className="bg-secondary/20 rounded-xl overflow-hidden border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Auditorium</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Requested By</th>
                  <th className="p-4 font-medium">Reason</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4 font-medium">{b.auditorium.name}</td>
                    <td className="p-4">{new Date(b.date).toLocaleDateString()} <br/><span className="text-muted-foreground">{b.timeSlot}</span></td>
                    <td className="p-4">{b.user.name} <br/><span className="text-muted-foreground text-xs">{b.user.email}</span></td>
                    <td className="p-4 max-w-xs truncate" title={b.reason}>{b.reason}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        b.status === 'APPROVED' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                        b.status === 'REJECTED' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {b.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'APPROVED')} className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500/40 rounded transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus(b.id, 'REJECTED')} className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <div className="p-10 text-center text-muted-foreground">No bookings found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}






