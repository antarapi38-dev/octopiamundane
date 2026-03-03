import React, { useState, useEffect, useRef } from 'react';
import { getData, setData } from '../lib/storage';
import { Bot, User, Send, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';

export default function AIAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      sender: 'ai',
      text: 'Halo Pak Budi! Berdasarkan data Anda, ada 2 hal yang perlu segera diperhatikan: dokumen kripto belum lengkap dan polis asuransi sudah kedaluwarsa. Apakah Anda ingin saya bantu jelaskan langkah selanjutnya?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      sender: 'user',
      text: 'Bagaimana cara pembagian kripto menurut Islam?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 3,
      sender: 'ai',
      text: 'Aset kripto dalam hukum Faraidh diperlakukan sebagai māl (harta), sehingga wajib masuk dalam perhitungan waris. Pastikan seed phrase dan private key disimpan aman di Brankas Digital AsetSantun...',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ];

  useEffect(() => {
    const history = getData('wd_ai_history', initialMessages);
    setMessages(history);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setData('wd_ai_history', messages);
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = [
        {
          role: 'system',
          content: 'Anda adalah AI Advisor khusus untuk aplikasi AsetSantun. Anda adalah pakar hukum waris yang bijaksana dan membantu. Tugas utama Anda adalah:\n1. Menjawab pertanyaan seputar hukum waris (Faraidh Islam, Perdata/KUHPer, dan Wasiat) secara mendalam namun mudah dimengerti.\n2. Memberikan panduan penggunaan fitur aplikasi AsetSantun (seperti kalkulator waris, brankas dokumen, atau daftar aset).\n\nBATASAN KETAT:\n- JANGAN menjawab pertanyaan di luar topik hukum waris atau penggunaan aplikasi AsetSantun.\n- Jika pengguna bertanya tentang topik umum, politik, hiburan, atau hal lain, jawablah dengan sopan: "Maaf, sebagai AI Advisor AsetSantun, saya hanya dapat membantu Anda terkait pertanyaan hukum waris dan penggunaan aplikasi ini. Apakah ada hal terkait warisan yang ingin Anda diskusikan?"\n- Gunakan bahasa Indonesia yang formal namun ramah.'
        },
        ...updatedMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          // GANTI API KEY ANDA DI BARIS INI:
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AsetSantun'
        },
        body: JSON.stringify({
          model: 'arcee-ai/trinity-large-preview:free',
          messages: apiMessages
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const newAiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Maaf, terjadi kesalahan saat menghubungi server AI. Silakan coba lagi nanti.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const topics = [
    { id: 'faraidh', label: 'Hukum Faraidh', query: 'Jelaskan dasar hukum Faraidh dalam Islam' },
    { id: 'perdata', label: 'Hukum Perdata', query: 'Bagaimana pembagian waris menurut KUHPerdata?' },
    { id: 'kripto', label: 'Aset Kripto', query: 'Apakah aset kripto bisa diwariskan?' },
    { id: 'properti', label: 'Properti & Tanah', query: 'Berapa biaya balik nama sertifikat tanah warisan?' },
    { id: 'umum', label: 'Pertanyaan Umum', query: 'Apa langkah pertama mengurus warisan?' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar Topik */}
      <div className="w-full lg:w-64 flex-shrink-0 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-4 flex flex-col h-auto lg:h-full">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-serif text-lg font-bold">Topik Diskusi</h3>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto hide-scrollbar">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setInput(topic.query)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left group border border-transparent hover:border-[var(--border)]"
            >
              <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{topic.label}</span>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gradient-to-br from-[#B8902A]/10 to-[#D4A843]/10 rounded-xl border border-[#D4A843]/20">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            <strong className="text-[var(--accent)]">Disclaimer:</strong> Saran AI hanya bersifat informatif dan tidak menggantikan nasihat hukum profesional dari Notaris/Pengacara.
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm flex flex-col h-[500px] lg:h-full overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--border)] bg-gray-100 dark:bg-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8902A] to-[#D4A843] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Waris AI Advisor</h3>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[var(--bg-primary)]/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === 'user'
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                : 'bg-gradient-to-br from-[#B8902A] to-[#D4A843] text-white shadow-sm'
                }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                  ? 'bg-[var(--bg-sidebar)] text-white rounded-tr-sm border border-transparent'
                  : 'bg-white dark:bg-[var(--bg-card)] text-[var(--text-primary)] rounded-tl-sm border border-[var(--border)]'
                  }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-[var(--text-muted)] mt-1.5 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8902A] to-[#D4A843] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border)]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan Anda di sini..."
              className="w-full pl-4 pr-14 py-3.5 bg-gray-100 dark:bg-gray-800 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-[var(--accent)] text-[#1E1810] rounded-lg hover:bg-[#D4A843] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
