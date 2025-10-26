import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Matched() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [loadingMessages, setLoadingMessages] = useState({});

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSharing = async (matchId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/match/${matchId}/toggle-image-sharing`,
        { method: 'POST' }
      );
      if (response.ok) {
        const data = await response.json();
        setMatches(matches.map(m =>
          m.id === matchId
            ? { ...m, image_sharing_enabled: data.image_sharing_enabled }
            : m
        ));
      }
    } catch (error) {
      console.error('Error toggling image sharing:', error);
    }
  };

  const toggleVideoCalls = async (matchId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/match/${matchId}/toggle-video-calls`,
        { method: 'POST' }
      );
      if (response.ok) {
        const data = await response.json();
        setMatches(matches.map(m =>
          m.id === matchId
            ? { ...m, video_calls_enabled: data.video_calls_enabled }
            : m
        ));
      }
    } catch (error) {
      console.error('Error toggling video calls:', error);
    }
  };

  const fetchMessages = async (matchId) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
      return;
    }

    setLoadingMessages({ ...loadingMessages, [matchId]: true });
    try {
      const response = await fetch(
        `http://localhost:8000/admin/match/${matchId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages({ ...messages, [matchId]: data.messages });
        setExpandedMatch(matchId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages({ ...loadingMessages, [matchId]: false });
    }
  };

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark">
            Matched Pairs ({matches.length})
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
              Loading matches...
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70 text-lg">
              No matches yet. Create matches from the vacant users pages.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beneficiary */}
                  <div className="bg-beneficiary-light dark:bg-beneficiary-dark/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🙋</div>
                      <div className="font-semibold text-beneficiary-dark dark:text-beneficiary-light">
                        Beneficiary
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-bold">{match.beneficiary?.alias}</div>
                      <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                        {match.beneficiary?.real_name}
                      </div>
                      <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                        {match.beneficiary?.email}
                      </div>
                    </div>
                  </div>

                  {/* Volunteer */}
                  <div className="bg-volunteer-light dark:bg-volunteer-dark/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">👨‍🦰</div>
                      <div className="font-semibold text-volunteer-dark dark:text-volunteer-light">
                        Volunteer
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-bold">{match.volunteer?.alias}</div>
                      <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                        {match.volunteer?.real_name}
                      </div>
                      <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                        {match.volunteer?.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Image Sharing Toggle */}
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📷</span>
                        <span className="text-sm font-medium">Image Sharing</span>
                      </div>
                      <button
                        onClick={() => toggleImageSharing(match.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          match.image_sharing_enabled
                            ? 'bg-green-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            match.image_sharing_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Video Calls Toggle */}
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📹</span>
                        <span className="text-sm font-medium">Video Calls</span>
                      </div>
                      <button
                        onClick={() => toggleVideoCalls(match.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          match.video_calls_enabled
                            ? 'bg-green-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            match.video_calls_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* View Conversation Button */}
                    <button
                      onClick={() => fetchMessages(match.id)}
                      className="bg-admin hover:bg-admin-dark text-white rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💬</span>
                      {expandedMatch === match.id ? 'Hide' : 'View'} Conversation
                    </button>
                  </div>

                  {/* Match Info */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                      Matched on:{' '}
                      {new Date(match.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                        {match.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conversation View */}
                {expandedMatch === match.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-textbase-light dark:text-textbase-dark">
                      Conversation History
                    </h3>
                    {loadingMessages[match.id] ? (
                      <div className="text-center py-8 text-textbase-light/70 dark:text-textbase-dark/70">
                        Loading messages...
                      </div>
                    ) : messages[match.id]?.length === 0 ? (
                      <div className="text-center py-8 text-textbase-light/70 dark:text-textbase-dark/70">
                        No messages yet in this conversation.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                        {messages[match.id]?.map((msg) => {
                          const isBeneficiary = msg.sender_id === match.beneficiary_id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${
                                isBeneficiary ? 'justify-start' : 'justify-end'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isBeneficiary
                                    ? 'bg-beneficiary-light dark:bg-beneficiary-dark/30'
                                    : 'bg-volunteer-light dark:bg-volunteer-dark/30'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold">
                                    {isBeneficiary
                                      ? match.beneficiary?.alias
                                      : match.volunteer?.alias}
                                  </span>
                                  <span className="text-xs text-textbase-light/60 dark:text-textbase-dark/60">
                                    {new Date(msg.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-sm">{msg.text}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
