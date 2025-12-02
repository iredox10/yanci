import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, USERS } from '../../context/AuthContext';
import { FaLock } from 'react-icons/fa6';

const AdminLogin = () => {
  const [selectedUser, setSelectedUser] = useState(USERS[0].id);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(selectedUser);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="bg-[#0f3036] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-[#c59d5f] text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f3036]">Yanci Admin</h1>
          <p className="text-gray-500">Select an account to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User Role
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent"
            >
              {USERS.map(user => (
                <option key={user.id} value={user.id}>
                  {user.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f3036] text-white py-3 rounded-md font-bold hover:bg-[#1a4e56] transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-[#0f3036]">
            &larr; Back to Public Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
