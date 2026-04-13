import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { account } from '../../lib/appwrite';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheck,
  FaTriangleExclamation, FaArrowRightFromBracket,
} from 'react-icons/fa6';

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [pwStatus, setPwStatus] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/admin/login'); return; }
    setProfile({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await account.updateName(profile.name);
      setStatus('success');
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus(null);
    if (passwordForm.new !== passwordForm.confirm) {
      setPwStatus('mismatch');
      return;
    }
    if (passwordForm.new.length < 8) {
      setPwStatus('short');
      return;
    }
    setPwSaving(true);
    try {
      await account.updatePassword(passwordForm.new, passwordForm.current || undefined);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setPwStatus('success');
      setTimeout(() => setPwStatus(null), 3000);
    } catch (e) {
      setPwStatus('error');
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Log out from all other devices?')) return;
    try {
      await account.deleteSessions();
      logout();
      navigate('/admin/login');
    } catch (e) {
      alert('Failed to logout from other devices');
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your Profile</h2>
          <p className="text-sm text-gray-500">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-[#c59d5f]" /> Profile Information
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
              <input value={profile.email} disabled className="w-full text-sm p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact a super admin if needed.</p>
            </div>
            <div className="flex items-center gap-2">
              {status === 'success' && <span className="text-sm text-green-600 font-bold flex items-center gap-1"><FaCheck /> Profile updated</span>}
              {status === 'error' && <span className="text-sm text-red-600 font-bold flex items-center gap-1"><FaTriangleExclamation /> Update failed</span>}
            </div>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm hover:bg-[#1a454c] disabled:opacity-50 flex items-center gap-2">
              {saving && <FaSpinner className="animate-spin" />} Save Changes
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
            <FaLock className="text-[#c59d5f]" /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Current Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">New Password</label>
              <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} placeholder="At least 8 characters" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Confirm New Password</label>
              <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
            </div>
            <div className="flex items-center gap-2">
              {pwStatus === 'success' && <span className="text-sm text-green-600 font-bold flex items-center gap-1"><FaCheck /> Password changed</span>}
              {pwStatus === 'mismatch' && <span className="text-sm text-red-600 font-bold flex items-center gap-1"><FaTriangleExclamation /> Passwords don't match</span>}
              {pwStatus === 'short' && <span className="text-sm text-red-600 font-bold flex items-center gap-1"><FaTriangleExclamation /> Password too short</span>}
              {pwStatus === 'error' && <span className="text-sm text-red-600 font-bold flex items-center gap-1"><FaTriangleExclamation /> Failed. Check current password.</span>}
            </div>
            <button type="submit" disabled={pwSaving} className="px-6 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm hover:bg-[#1a454c] disabled:opacity-50 flex items-center gap-2">
              {pwSaving && <FaSpinner className="animate-spin" />} Update Password
            </button>
          </form>
        </div>

        {/* Session Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
            <FaArrowRightFromBracket className="text-[#c59d5f]" /> Sessions
          </h3>
          <p className="text-sm text-gray-500 mb-4">Log out from all other devices where you're currently signed in.</p>
          <button onClick={handleLogoutAll} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg font-bold text-sm hover:bg-red-50 flex items-center gap-2">
            <FaArrowRightFromBracket className="w-4 h-4" /> Logout Everywhere Else
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
