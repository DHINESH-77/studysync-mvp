import { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { database } from '../../firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { Settings, Users, FileText, BarChart3, Plus, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState('subjects');
  const [departments, setDepartments] = useState({});
  const [users, setUsers] = useState({});
  const [files, setFiles] = useState({});
  const [chats, setChats] = useState({});

  // Load data
  useEffect(() => {
    if (!isAdmin) return;

    // Load departments/subjects
    const deptRef = ref(database, 'departments');
    const deptUnsubscribe = onValue(deptRef, (snapshot) => {
      setDepartments(snapshot.val() || {});
    });

    // Load users (from auth data)
    const usersRef = ref(database, 'users');
    const usersUnsubscribe = onValue(usersRef, (snapshot) => {
      setUsers(snapshot.val() || {});
    });

    // Load files
    const filesRef = ref(database, 'materials');
    const filesUnsubscribe = onValue(filesRef, (snapshot) => {
      setFiles(snapshot.val() || {});
    });

    // Load chats
    const chatsRef = ref(database, 'chats');
    const chatsUnsubscribe = onValue(chatsRef, (snapshot) => {
      setChats(snapshot.val() || {});
    });

    return () => {
      deptUnsubscribe();
      usersUnsubscribe();
      filesUnsubscribe();
      chatsUnsubscribe();
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'subjects', label: 'Subjects', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderSubjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Subject Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>
      
      <div className="grid gap-4">
        {Object.entries(departments).map(([deptId, dept]) => (
          <div key={deptId} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">{dept.name}</h3>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {dept.subjects && Object.entries(dept.subjects).map(([subId, subject]) => (
                <div key={subId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{subject.name} (Sem {subject.semester})</span>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersTab = () => {
    const userCount = Object.keys(users).length;
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">User Management</h2>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-blue-800 font-medium">{userCount} Total Users</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(users).map(([userId, user]) => (
                <tr key={userId} className="border-t">
                  <td className="px-4 py-3">{user.displayName || 'Anonymous'}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button className="text-red-600 hover:bg-red-50 px-2 py-1 rounded">
                      Ban
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

  const renderAnalyticsTab = () => {
    const totalFiles = Object.values(files).reduce((acc, dept) => 
      acc + Object.values(dept).reduce((deptAcc, subject) => 
        deptAcc + Object.values(subject).reduce((subAcc, type) => 
          subAcc + Object.keys(type).length, 0), 0), 0);
    
    const totalMessages = Object.values(chats).reduce((acc, dept) => 
      acc + Object.values(dept).reduce((deptAcc, subject) => 
        deptAcc + Object.keys(subject).length, 0), 0);

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Analytics Dashboard</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(users).length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-600">Total Files</h3>
            <p className="text-2xl font-bold text-green-600">{totalFiles}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-600">Chat Messages</h3>
            <p className="text-2xl font-bold text-purple-600">{totalMessages}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-600">Departments</h3>
            <p className="text-2xl font-bold text-orange-600">{Object.keys(departments).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Popular Subjects</h3>
          <div className="space-y-2">
            {Object.entries(files).map(([deptId, dept]) => 
              Object.entries(dept).map(([subjectId, subject]) => {
                const fileCount = Object.values(subject).reduce((acc, type) => acc + Object.keys(type).length, 0);
                return (
                  <div key={`${deptId}-${subjectId}`} className="flex justify-between items-center">
                    <span>{deptId.toUpperCase()} - {subjectId.toUpperCase()}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">{fileCount} files</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">System Settings</h2>
      
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold mb-4">File Upload Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
            <input type="number" defaultValue="10" className="border rounded px-3 py-2 w-32" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Allowed File Types</label>
            <input type="text" defaultValue=".pdf,.ppt,.pptx,.doc,.docx" className="border rounded px-3 py-2 w-full" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold mb-4">Chat Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message Character Limit</label>
            <input type="number" defaultValue="500" className="border rounded px-3 py-2 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="autoModeration" />
            <label htmlFor="autoModeration" className="text-sm">Enable Auto-Moderation</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'subjects': return renderSubjectsTab();
      case 'users': return renderUsersTab();
      case 'analytics': return renderAnalyticsTab();
      case 'settings': return renderSettingsTab();
      default: return renderSubjectsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">StudySync Admin Panel</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-6">
          <div className="w-64 bg-white rounded-lg border p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;