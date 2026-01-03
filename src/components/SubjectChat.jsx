import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Pin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';

const SubjectChat = () => {
  const { deptId, subjectId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatRef = ref(database, `chats/${deptId}/${subjectId}`);

  // Load messages from Firebase Realtime Database
  useEffect(() => {
    setMessages([]); // Clear messages immediately
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [deptId, subjectId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    const newMessage = {
      user: user?.displayName || 'Anonymous',
      message: message.trim(),
      timestamp: serverTimestamp(),
      isPinned: false
    };

    try {
      await push(chatRef, newMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const subjectNames = {
    ds: 'Data Structures',
    os: 'Operating Systems',
    cn: 'Computer Networks',
    dbms: 'Database Management Systems',
    se: 'Software Engineering'
  };

  const subjectName = subjectNames[subjectId] || 'Subject';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to={`/subject/${deptId}/${subjectId}`} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{subjectName} - Doubt Chat</h1>
              <p className="text-sm text-gray-600">Ask doubts, help peers, keep it academic</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow-sm mb-4 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the discussion!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className={`p-4 rounded-lg ${msg.isPinned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{msg.user}</span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Just now'}
                        </span>
                        {msg.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                      </div>
                    </div>
                    <p className="text-gray-800">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your doubt about this subject..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectChat;