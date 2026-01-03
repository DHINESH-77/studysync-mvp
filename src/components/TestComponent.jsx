import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

const TestComponent = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold">Debug Info:</h3>
      <p>User: {user ? user.displayName : 'Not logged in'}</p>
      <p>Email: {user ? user.email : 'No email'}</p>
      <p>Is Admin: {isAdmin ? 'YES' : 'NO'}</p>
    </div>
  );
};

export default TestComponent;