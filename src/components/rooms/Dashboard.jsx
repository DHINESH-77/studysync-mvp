import { useAuth } from '../../contexts/AuthContext';
import DepartmentSelection from '../DepartmentSelection';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Select your department to access study resources
          </p>
        </div>
      </div>
      <DepartmentSelection />
    </div>
  );
};

export default Dashboard;