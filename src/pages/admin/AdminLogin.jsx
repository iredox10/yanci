import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaEnvelope, FaKey } from 'react-icons/fa6';

const AdminLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/admin');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result?.ok) {
      navigate('/admin');
    } else {
      setError(result?.error || 'An sami matsala. Gwada sake.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f3036] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <FaLock className="text-[#c59d5f] text-2xl" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Yanci Admin</h1>
          <p className="text-white/50 text-sm mt-1">Shigar da imel da kalmar sirri don shiga</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                <FaEnvelope className="inline w-3 h-3 mr-1 text-[#c59d5f]" />
                Imel
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@yanci.ng"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent bg-gray-50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                <FaKey className="inline w-3 h-3 mr-1 text-[#c59d5f]" />
                Kalmar Sirri
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent bg-gray-50 transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#0f3036] text-white py-3.5 rounded-xl font-bold hover:bg-[#1a4e56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? 'Ana shiga...' : 'Shiga Tsarin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-[#0f3036] transition-colors">
              &larr; Koma Shafin Jama'a
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
