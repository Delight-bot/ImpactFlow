import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FlaggedMessages() {
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedMessages();
  }, []);

  const fetchFlaggedMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/flagged-messages');
      if (response.ok) {
        const data = await response.json();
        setFlaggedMessages(data.flagged_messages);
      }
    } catch (error) {
      console.error('Error fetching flagged messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveMessage = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/message/${messageId}/approve`,
        { method: 'POST' }
      );
      if (response.ok) {
        alert('Message approved and sent!');
        fetchFlaggedMessages();
      }
    } catch (error) {
      console.error('Error approving message:', error);
    }
  };

  const rejectMessage = async (messageId) => {
    if (!confirm('Are you sure you want to reject this message? It will not be sent.')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/admin/message/${messageId}/reject`,
        { method: 'POST' }
      );
      if (response.ok) {
        alert('Message rejected');
        fetchFlaggedMessages();
      }
    } catch (error) {
      console.error('Error rejecting message:', error);
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      name_questions: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      location_questions: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      contact_info: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      meetup: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      personal_identifiers: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      name_questions: 'Name Question',
      location_questions: 'Location Question',
      contact_info: 'Contact Info',
      meetup: 'Meetup Request',
      personal_identifiers: 'Personal Info'
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark">
            Flagged Messages ({flaggedMessages.length})
          </h1>
          <Link
            to="/admin"
            className="bg-admin hover:bg-admin-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70">
              Loading flagged messages...
            </p>
          </div>
        ) : flaggedMessages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70 text-lg">
              No flagged messages pending review!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                {/* Match Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-beneficiary-light dark:bg-beneficiary-dark/20 rounded-lg p-3">
                    <div className="text-xs text-textbase-light/60 dark:text-textbase-dark/60 mb-1">
                      Sender
                    </div>
                    <div className="font-semibold">{msg.sender.alias}</div>
                    <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                      {msg.sender.role === 'beneficiary' ? '🙋 Beneficiary' : '👨‍🦰 Volunteer'}
                    </div>
                  </div>
                  <div className="bg-volunteer-light dark:bg-volunteer-dark/20 rounded-lg p-3">
                    <div className="text-xs text-textbase-light/60 dark:text-textbase-dark/60 mb-1">
                      Receiver
                    </div>
                    <div className="font-semibold">{msg.receiver.alias}</div>
                    <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                      {msg.receiver.role === 'beneficiary' ? '🙋 Beneficiary' : '👨‍🦰 Volunteer'}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-4">
                  <div className="text-sm text-textbase-light/60 dark:text-textbase-dark/60 mb-2">
                    Message Content
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-textbase-light dark:text-textbase-dark">{msg.text}</p>
                  </div>
                  <div className="text-xs text-textbase-light/50 dark:text-textbase-dark/50 mt-1">
                    Sent: {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Flagged Categories */}
                <div className="mb-4">
                  <div className="text-sm text-textbase-light/60 dark:text-textbase-dark/60 mb-2">
                    Flagged For
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.flagged_info?.category_summary?.map((category) => (
                      <span
                        key={category}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(category)}`}
                      >
                        {getCategoryLabel(category)}
                      </span>
                    ))}
                  </div>

                  {/* Show matched patterns */}
                  {msg.flagged_info?.flagged_patterns && msg.flagged_info.flagged_patterns.length > 0 && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-textbase-light/60 dark:text-textbase-dark/60 hover:text-textbase-light dark:hover:text-textbase-dark">
                          View matched patterns ({msg.flagged_info.flagged_patterns.length})
                        </summary>
                        <div className="mt-2 space-y-1 ml-4">
                          {msg.flagged_info.flagged_patterns.slice(0, 5).map((pattern, idx) => (
                            <div key={idx} className="text-textbase-light/70 dark:text-textbase-dark/70">
                              • "{pattern.pattern}"
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => approveMessage(msg.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✓</span> Approve & Send
                  </button>
                  <button
                    onClick={() => rejectMessage(msg.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✗</span> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
