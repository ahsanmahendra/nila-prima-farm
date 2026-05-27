// frontend/src/components/Chatbot.jsx
// Fitur: bubble chat, typing animation, auto scroll, keyword intent, data realtime AI

import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../services/api';

// ── Format markdown bold (**text**) ke JSX ────────────────────────────────────
const formatMessage = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : part
  );
};

// ── Render pesan dengan baris baru ────────────────────────────────────────────
const MessageContent = ({ text }) => (
  <div className="text-sm leading-relaxed whitespace-pre-line">
    {text.split('\n').map((line, i) => (
      <p key={i} className={line === '' ? 'h-2' : ''}>{formatMessage(line)}</p>
    ))}
  </div>
);

// ── Quick reply chips ──────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  'Produk paling diminati?',
  'Prediksi penjualan minggu depan?',
  'Stok yang perlu ditambah?',
  'Produk terbaik untuk pemula?',
  'Produk termurah?',
];

// ── Timestamp ─────────────────────────────────────────────────────────────────
const formatTime = (date) =>
  new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-sm">
      🐟
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1.5 items-center h-5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ── Main Chatbot Component ────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    {
      id   : 1,
      role : 'bot',
      text : 'Halo! Saya asisten AI Nila Prima Farm 🐟\n\nSaya bisa membantu kamu dengan informasi produk, prediksi penjualan, dan rekomendasi stok berdasarkan data realtime.',
      time : new Date(),
    },
  ]);
  const [input,   setInput]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  // Fokus input saat chatbot dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg, time: new Date() }]);
    setLoading(true);
    setTyping(true);

    // Delay typing indicator agar terasa natural
    const typingDelay = 800 + Math.random() * 600;

    try {
     const { data } = await api.post('/ai/chat', { message: userMsg });

      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, {
          id   : Date.now() + 1,
          role : 'bot',
          text : data.reply,
          time : new Date(data.timestamp),
        }]);
        setLoading(false);
      }, typingDelay);

    } catch (err) {
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, {
          id   : Date.now() + 1,
          role : 'bot',
          text : 'Maaf, terjadi kesalahan. Pastikan kamu sudah login dan coba lagi.',
          time : new Date(),
          error: true,
        }]);
        setLoading(false);
      }, typingDelay);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Inject keyframe animation ── */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .chat-window { animation: fadeSlideUp 0.25s ease forwards; }
      `}</style>

      {/* ── FAB Toggle Button ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600
                   shadow-lg flex items-center justify-center text-white transition-all
                   hover:scale-110 active:scale-95"
        aria-label="Buka chatbot"
      >
        {isOpen
          ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        }
        {/* Badge notif saat tertutup */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs
                           flex items-center justify-center font-bold">
            AI
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="chat-window fixed bottom-24 right-6 z-50 w-[360px] max-h-[580px]
                        flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100
                        overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
              🐟
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Asisten AI</p>
              <p className="text-blue-100 text-xs">Nila Prima Farm • Powered by ML</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-1 min-h-0">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center
                                  flex-shrink-0 text-sm mb-1">
                    🐟
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm
                    ${msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : msg.error
                        ? 'bg-red-50 border border-red-100 text-red-700 rounded-bl-sm'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                    }`}>
                    <MessageContent text={msg.text} />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {formatTime(msg.time)}
                  </span>
                </div>
              </div>
            ))}

            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_REPLIES.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="flex-shrink-0 text-[11px] px-3 py-1.5 bg-white border border-blue-200
                             text-blue-600 rounded-full hover:bg-blue-50 hover:border-blue-400
                             transition disabled:opacity-40 whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan..."
              disabled={loading}
              className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50
                         px-3 py-2 text-sm text-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-300
                         disabled:opacity-50 max-h-24 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600
                         disabled:bg-gray-200 text-white flex items-center justify-center
                         transition flex-shrink-0"
            >
              <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
