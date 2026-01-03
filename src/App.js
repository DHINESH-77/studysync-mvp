import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/rooms/Dashboard';
import SubjectSelection from './components/SubjectSelection';
import SubjectPage from './components/rooms/SubjectPage';
import SubjectChat from './components/SubjectChat';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/:deptId" 
                element={
                  <ProtectedRoute>
                    <SubjectSelection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subject/:deptId/:subjectId" 
                element={
                  <ProtectedRoute>
                    <SubjectPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subject/:deptId/:subjectId/chat" 
                element={
                  <ProtectedRoute>
                    <SubjectChat />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;