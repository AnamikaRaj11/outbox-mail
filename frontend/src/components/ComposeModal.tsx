import React, { useState } from 'react';

interface ComposeModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [delayBetweenEmails, setDelayBetweenEmails] = useState(2);
  const [hourlyLimit, setHourlyLimit] = useState(200);
  const [leads, setLeads] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        // Basic CSV parse: extract emails
        const emails = text.split(/[\n,]+/).map(s => s.trim()).filter(s => s.includes('@'));
        setLeads(emails);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject,
      body,
      scheduledAt: scheduledAt || new Date().toISOString(),
      delayBetweenEmails,
      hourlyLimit,
      leads
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Compose New Email Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input 
              required
              type="text" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Exciting Opportunity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea 
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 h-32 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your email content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Leads (CSV)</label>
            <input 
              type="file" 
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {leads.length > 0 && <p className="text-sm text-green-600 mt-2">✓ Detected {leads.length} valid email addresses.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (Local)</label>
              <input 
                type="datetime-local" 
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Limit</label>
              <input 
                type="number" 
                value={hourlyLimit}
                onChange={e => setHourlyLimit(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={leads.length === 0} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            Schedule Emails
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;
