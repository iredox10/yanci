import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserPlus, FaTrash, FaShieldHalved, FaEnvelope } from 'react-icons/fa6';

const MOCK_STAFF = [
  { id: 1, name: "Amina Yusuf", email: "amina.y@yanci.ng", role: "Editor-in-Chief", status: "Active", avatar: "AY" },
  { id: 2, name: "Ibrahim Sani", email: "ibrahim.s@yanci.ng", role: "Senior Reporter", status: "Active", avatar: "IS" },
  { id: 3, name: "Chinedu Okafor", email: "chinedu.o@yanci.ng", role: "Tech Lead", status: "Active", avatar: "CO" },
  { id: 4, name: "Fatima Bello", email: "fatima.b@yanci.ng", role: "Intern", status: "On Leave", avatar: "FB" },
];

const AdminStaff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(MOCK_STAFF);

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  if (!user || user.role !== 'super_admin') return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0f3036]">Staff Management</h2>
          <p className="text-sm text-gray-500">Manage editorial team access.</p>
        </div>
        <button className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a4a52] transition-colors font-bold text-sm w-full sm:w-auto">
          <FaUserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-600 text-[10px]">Name</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-[10px]">Role</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-[10px] hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#c59d5f]/20 text-[#c59d5f] flex items-center justify-center font-bold text-xs md:text-sm">
                        {member.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#0f3036] truncate">{member.name}</div>
                        <div className="text-gray-400 text-[10px] flex items-center gap-1 truncate">
                          <FaEnvelope className="w-2.5 h-3" /> {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      <FaShieldHalved className="w-2.5 h-2.5" /> {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      member.status === 'Active' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
