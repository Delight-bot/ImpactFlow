import { useState, useEffect, useRef } from 'react';

export default function ChatView({ match, currentUser, roleColor }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isBeneficiary = currentUser.role === 'beneficiary';
  const otherUser = isBeneficiary ? match.volunteer : match.beneficiary;
  const otherUserId = otherUser?.id;

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [match.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/messages/${match.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const response = await fetch('http://localhost:8000/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: match.id,
          sender_id: currentUser.id,
          receiver_id: otherUserId,
          text: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Check if message was flagged
      if (data.is_flagged) {
        alert(`⚠️ Your message has been flagged for admin review.\n\nReason: It may contain identity-revealing information (${data.flagged_categories.join(', ')}).\n\nAn admin will review it before it's sent.`);
      }

      setNewMessage('');
      // Immediately fetch messages to show the new one
      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className={`bg-${roleColor} text-white px-6 py-4 rounded-t-lg`}>
        <h3 className="font-semibold text-lg">{otherUser?.alias || 'Unknown'}</h3>
        <p className="text-sm opacity-90">{otherUser?.real_name || 'Anonymous'}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUser.id;
            const isPending = message.status === 'pending_review';

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isPending
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600'
                      : isOwnMessage
                      ? `bg-${roleColor} text-white`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  {isPending && isOwnMessage && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-yellow-400 dark:border-yellow-600">
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                        ⏳ Pending Admin Review
                      </span>
                    </div>
                  )}
                  <p className={`text-sm break-words ${isPending ? 'text-gray-800 dark:text-gray-200' : ''}`}>
                    {message.text}
                  </p>
                  <p className={`text-xs mt-1 ${isPending ? 'text-yellow-700 dark:text-yellow-400 opacity-90' : 'opacity-75'}`}>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {isPending && isOwnMessage && (
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                      Message flagged for identity-revealing content
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="border-t dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-${roleColor} dark:bg-gray-700 dark:text-white"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className={`bg-${roleColor} hover:bg-${roleColor}-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
