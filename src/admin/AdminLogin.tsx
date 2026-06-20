import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'luxury') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4 font-sans selection:bg-antique-gold selection:text-obsidian">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-antique-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-champagne/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <Lock className="w-8 h-8 text-antique-gold mx-auto mb-4 stroke-[1.5]" />
          <h1 className="font-serif text-3xl text-white tracking-widest font-light uppercase">
            Maheera Admin
          </h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] mt-3 font-display">
            Secure Portal Access
          </p>
          <div className="w-12 h-[1px] bg-antique-gold mx-auto mt-6" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-display tracking-widest text-stone-300 uppercase">
              Administrator ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-antique-gold transition-colors font-mono"
              placeholder="Enter ID"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-display tracking-widest text-stone-300 uppercase">
              Passphrase
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-antique-gold transition-colors font-mono"
              placeholder="Enter Passphrase"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-rose-400 text-xs mt-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Invalid credentials. Access denied.</span>
            </motion.div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-antique-gold hover:bg-[#ae8f53] text-obsidian font-display text-xs tracking-widest py-4 uppercase transition-all duration-300 shadow-lg font-medium"
            >
              Authenticate
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
