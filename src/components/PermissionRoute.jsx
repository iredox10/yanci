import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

const PermissionRoute = ({ children, permission }) => {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();

  if (loading) {
    return <div className="min-h-screen bg-[#0f3036] flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm">You don't have permission to access this page.</p>
          <a href="/admin" className="inline-block mt-4 px-4 py-2 bg-[#0f3036] text-white rounded-lg text-sm font-bold hover:bg-[#1a454c]">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return children;
};

export default PermissionRoute;
