import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

// Admin emails - add your email here
const ADMIN_EMAILS = [
  'dhinesh9952654131@gmail.com' // Replace with your actual email
];

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    if (user?.email) {
      // Check if user email is in admin list
      const adminStatus = ADMIN_EMAILS.includes(user.email);
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        // Load admin-specific data
        const adminRef = ref(database, 'admin');
        const unsubscribe = onValue(adminRef, (snapshot) => {
          setAdminData(snapshot.val() || {});
        });
        return () => unsubscribe();
      }
    } else {
      setIsAdmin(false);
      setAdminData(null);
    }
  }, [user]);

  const value = {
    isAdmin,
    adminData,
    user
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};