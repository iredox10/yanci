import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { appwriteService } from '../lib/appwrite';
import { FaLock, FaEnvelope, FaUser, FaCheck, FaTriangleExclamation, FaSpinner, FaKey } from 'react-icons/fa6';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const inv = await appwriteService.getInvitationByToken(token);
        if (!inv) { setError('Invalid or expired invitation link.'); setLoading(false); return; }
        if (inv.status === 'accepted') { setError('This invitation has already been used.'); setLoading(false); return; }
        if (inv.status === 'revoked') { setError('This invitation has been revoked.'); setLoading(false); return; }
        if (inv.expires_at && new Date(inv.expires_at) < new Date()) { setError('This invitation has expired.'); setLoading(false); return; }
        setInvitation(inv);
        setForm(prev => ({ ...prev, name: inv.name, email: inv.email }));
      } catch (e) {
        setError('Failed to load invitation.');
      } finally {
        setLoading(false);
      }
    };
    loadInvite();
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!token || !invitation) { setError('No valid invitation found'); return; }

    setRegistering(true);
    try {
      // Create Appwrite account
      await account.create('unique()', invitation.email, form.password, invitation.name);

      // Mark invitation as accepted
      await appwriteService.updateInvitation(invitation.$id, { status: 'accepted' });

      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (e) {
      if (e.message?.includes('already exists')) {
        setError('An account with this email already exists. Try logging in instead.');
      } else {
        setError('Registration failed: ' + (e.message || 'Unknown error'));
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f3036] flex items-center justify-center"><FaSpinner className="animate-spin text-white text-2xl" /></div>;

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f3036] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 mb-4">
            <FaCheck className="text-green-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-black text-white">Account Created!</h1>
          <p className="text-white/50 text-sm mt-2">Your admin account is ready. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-[#0f3036] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
              <FaTriangleExclamation className="text-red-500 text-2xl" />
            </div>
            <h1 className="text-xl font-black text-gray-900">No Invitation Found</h1>
            <p className="text-gray-500 text-sm mt-2">You need a valid invite link to register as an admin. Contact your site administrator.</p>
            <a href="/" className="inline-block mt-4 text-sm font-bold text-[#0f3036] hover:text-[#c59d5f]">&larr; Back to Yanci</a>
          </div>
        </div>
      </div>
    );
  }

  if (error && token) {
    return (
      <div className="min-h-screen bg-[#0f3036] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
              <FaTriangleExclamation className="text-red-500 text-2xl" />
            </div>
            <h1 className="text-xl font-black text-gray-900">Invalid Invitation</h1>
            <p className="text-gray-500 text-sm mt-2">{error}</p>
            <a href="/" className="inline-block mt-4 text-sm font-bold text-[#0f3036] hover:text-[#c59d5f]">&larr; Back to Yanci</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f3036] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <FaKey className="text-[#c59d5f] text-2xl" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Join Yanci Admin</h1>
          <p className="text-white/50 text-sm mt-1">
            {invitation ? `Invited by ${invitation.invited_by || 'admin'} as ${invitation.role || 'editor'}` : 'Create your admin account'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                <FaUser className="inline w-3 h-3 mr-1 text-[#c59d5f]" /> Full Name
              </label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required readOnly={!!invitation} className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f] transition ${invitation ? 'bg-gray-50 text-gray-600' : 'bg-gray-50'}`} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                <FaEnvelope className="inline w-3 h-3 mr-1 text-[#c59d5f]" /> Email
              </label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required readOnly={!!invitation} className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f] transition ${invitation ? 'bg-gray-50 text-gray-600' : 'bg-gray-50'}`} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                <FaLock className="inline w-3 h-3 mr-1 text-[#c59d5f]" /> Password
              </label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" required minLength={8} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent bg-gray-50 transition" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                <FaLock className="inline w-3 h-3 mr-1 text-[#c59d5f]" /> Confirm Password
              </label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" required className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent bg-gray-50 transition" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <button type="submit" disabled={registering} className="w-full bg-[#0f3036] text-white py-3.5 rounded-xl font-bold hover:bg-[#1a4e56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide flex items-center justify-center gap-2">
              {registering && <FaSpinner className="animate-spin" />} Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-[#0f3036] transition-colors">&larr; Back to Yanci</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
