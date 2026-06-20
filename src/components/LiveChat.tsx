import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'concierge',
      text: 'Good evening. Welcome to the Maheera Private Desk. How may we assist with your portfolio today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Simulate concierge response
    setTimeout(() => {
      const conciergeMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'concierge',
        text: 'An advisor will review your request shortly. Is there a specific carat weight or collection you are interested in?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, conciergeMsg]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 2 }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[90] p-3 md:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 md:gap-3 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 cursor-pointer'
        } ${isHovered ? 'bg-antique-gold text-obsidian' : 'bg-obsidian text-warm-ivory border border-antique-gold/30'}`}
      >
        <MessageSquare className="w-5 h-5 stroke-[1.5]" />
        
        {/* Expandable text on hover */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'max-w- mx-auto ml-1' : 'max-w-0 ml-0'}`}>
          <span className="font-display text-[9px] uppercase tracking-widest whitespace-nowrap">
            Concierge
          </span>
        </div>
      </motion.button>

      {/* Chat Interface Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-[100] w-auto md:w-[350px] h-[500px] max-h-[80vh] bg-obsidian border border-white/10 rounded-xs shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-antique-gold/10 border border-antique-gold/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-antique-gold" />
                </div>
                <div>
                  <h3 className="text-white font-serif tracking-wide text-sm">Private Desk</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-sans text-gray-400 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0A0804]">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w- mx-auto%] p-3 text-[13px] font-sans font-light leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-antique-gold/10 text-white border border-antique-gold/20 rounded-t-xl rounded-l-xl' 
                        : 'bg-white/5 text-gray-200 border border-white/5 rounded-t-xl rounded-r-xl'
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[9px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-center'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Inquire with the concierge..."
                  className="w-full bg-transparent border-none text-white text-sm font-sans font-light focus:outline-none focus:ring-0 placeholder-gray-600 pr-10"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-0 text-antique-gold disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
