import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, FileText, HelpCircle, BookOpen, Presentation, Zap, Upload, Download, Trash2 } from 'lucide-react';
import { storage, database } from '../../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, push, onValue, remove } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';

const subjectNames = {
  ds: 'Data Structures',
  os: 'Operating Systems',
  cn: 'Computer Networks',
  dbms: 'Database Management Systems',
  se: 'Software Engineering'
};

const SubjectPage = () => {
  const { deptId, subjectId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notes');
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const subjectName = subjectNames[subjectId] || 'Subject';

  // Load files from database
  useEffect(() => {
    const filesRef = dbRef(database, `materials/${deptId}/${subjectId}`);
    const unsubscribe = onValue(filesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFiles(data);
      } else {
        setFiles({});
      }
    });
    return () => unsubscribe();
  }, [deptId, subjectId]);

  const handleUpload = (type) => {
    fileInputRef.current.setAttribute('data-type', type);
    fileInputRef.current.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Temporary: Show file info without uploading
    alert(`File selected: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\nFile upload temporarily disabled.\nChat and other features work normally.`);
    event.target.value = '';
  };

  const handleDownload = (downloadURL, fileName) => {
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    link.click();
  };

  const handleDelete = async (type, fileId, storagePath) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      // Delete from Storage
      const fileRef = storageRef(storage, storagePath);
      await deleteObject(fileRef);
      
      // Delete from Database
      const dbFileRef = dbRef(database, `materials/${deptId}/${subjectId}/${type}/${fileId}`);
      await remove(dbFileRef);
      
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const tabs = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'pyqs', label: 'PYQs', icon: HelpCircle },
    { id: 'pdfs', label: 'PDFs', icon: BookOpen },
    { id: 'ppts', label: 'PPTs', icon: Presentation },
    { id: 'revision', label: 'Quick Revision', icon: Zap }
  ];

  const renderContent = () => {
    const currentFiles = files[activeTab] || {};
    
    switch (activeTab) {
      case 'notes':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Unit-wise Notes</h3>
              <button 
                onClick={() => handleUpload('notes')}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Notes'}</span>
              </button>
            </div>
            {Object.keys(currentFiles).length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No notes uploaded yet. Be the first to share!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(currentFiles).map(([fileId, file]) => (
                  <div key={fileId} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.downloadURL, file.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {file.uploadedBy === user?.displayName && (
                        <button
                          onClick={() => handleDelete('notes', fileId, file.storagePath)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'pyqs':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Previous Year Questions</h3>
              <button 
                onClick={() => handleUpload('pyqs')}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload PYQ'}</span>
              </button>
            </div>
            {Object.keys(currentFiles).length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <HelpCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No PYQs uploaded yet. Share previous year papers!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(currentFiles).map(([fileId, file]) => (
                  <div key={fileId} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.downloadURL, file.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {file.uploadedBy === user?.displayName && (
                        <button
                          onClick={() => handleDelete('pyqs', fileId, file.storagePath)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'pdfs':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Reference Materials</h3>
              <button 
                onClick={() => handleUpload('pdfs')}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload PDF'}</span>
              </button>
            </div>
            {Object.keys(currentFiles).length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No PDFs uploaded yet. Share reference materials!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(currentFiles).map(([fileId, file]) => (
                  <div key={fileId} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-8 h-8 text-red-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.downloadURL, file.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {file.uploadedBy === user?.displayName && (
                        <button
                          onClick={() => handleDelete('pdfs', fileId, file.storagePath)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'ppts':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Presentations</h3>
              <button 
                onClick={() => handleUpload('ppts')}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload PPT'}</span>
              </button>
            </div>
            {Object.keys(currentFiles).length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <Presentation className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No presentations uploaded yet. Share your PPTs!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(currentFiles).map(([fileId, file]) => (
                  <div key={fileId} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Presentation className="w-8 h-8 text-orange-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.downloadURL, file.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {file.uploadedBy === user?.displayName && (
                        <button
                          onClick={() => handleDelete('ppts', fileId, file.storagePath)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'revision':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Quick Revision</h3>
              <button 
                onClick={() => handleUpload('revision')}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Add Content'}</span>
              </button>
            </div>
            {Object.keys(currentFiles).length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No revision materials yet. Share quick notes!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(currentFiles).map(([fileId, file]) => (
                  <div key={fileId} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-8 h-8 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.downloadURL, file.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {file.uploadedBy === user?.displayName && (
                        <button
                          onClick={() => handleDelete('revision', fileId, file.storagePath)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/department/${deptId}`} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{subjectName}</h1>
            </div>
            <Link
              to={`/subject/${deptId}/${subjectId}/chat`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Doubt Chat
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.png"
        className="hidden"
      />
    </div>
  );
};

export default SubjectPage;