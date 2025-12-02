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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0f3036]">Staff Management</h2>
          <p className="text-gray-500">Manage access and roles for the editorial team.</p>
        </div>
        <button className="bg-[#0f3036] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#1a4a52] transition-colors">
          <FaUserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c59d5f]/20 text-[#c59d5f] flex items-center justify-center font-bold text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-[#0f3036]">{member.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        <FaEnvelope className="w-3 h-3" /> {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <FaShieldHalved className="w-3 h-3" /> {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
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
  );
};

export default AdminStaff;
