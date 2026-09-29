import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import ComposeModal from './ComposeModal';

const API_URL = 'http://localhost:3000/api/emails';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'scheduled' | 'sent'>('scheduled');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${activeTab}?userId=${user?.id}`);
      setEmails(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchEmails();
  }, [activeTab, user]);

  const handleComposeSubmit = async (data: any) => {
    try {
      await axios.post(`${API_URL}/schedule`, {
        ...data,
        userId: user?.id
      });
      setIsComposeOpen(false);
      fetchEmails();
    } catch (err) {
      alert("Failed to schedule emails");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">ReachInbox Scheduler</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            <div className="text-sm">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button 
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'scheduled' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Scheduled Emails
            </button>
            <button 
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sent' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Sent Emails
            </button>
          </div>
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Compose New Email
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">{activeTab === 'scheduled' ? 'Scheduled For' : 'Sent At'}</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-12 text-gray-500">Loading...</td></tr>
                ) : emails.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-gray-500">No {activeTab} emails found.</td></tr>
                ) : (
                  emails.map(email => (
                    <tr key={email.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-6 py-4">{email.recipient}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{email.subject}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(activeTab === 'scheduled' ? email.scheduledAt : email.sentAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          email.status === 'SENT' ? 'bg-green-100 text-green-800' :
                          email.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {email.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isComposeOpen && (
        <ComposeModal onClose={() => setIsComposeOpen(false)} onSubmit={handleComposeSubmit} />
      )}
    </div>
  );
};

export default Dashboard;
