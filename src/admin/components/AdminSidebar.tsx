import { BarChart3, Users, Gem, FolderOpen, Shield, Settings } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';

export type AdminView = 'analytics' | 'crm' | 'customizer' | 'catalogue' | 'logistics' | 'settings';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  userRole: string;
  theme: 'dark' | 'light';
}

export default function AdminSidebar({ currentView, onViewChange, userRole, theme }: AdminSidebarProps) {
  const navItems = [
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
    { id: 'crm', label: 'VIP Clienteling', icon: Users },
    { id: 'customizer', label: 'Customizer Engine', icon: Gem },
    { id: 'catalogue', label: 'Salon Curation', icon: FolderOpen },
    { id: 'logistics', label: 'Armored Transit', icon: Shield },
  ] as const;

  const isDark = theme === 'dark';

  return (
    <aside className={`w-64 border-r h-screen flex flex-col fixed left-0 top-0 transition-colors ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-warm-ivory border-champagne'}`}>
      <div className={`p-8 border-b ${isDark ? 'border-gold-900/40' : 'border-champagne'}`}>
        <BrandLogo size={32} showText textColor={isDark ? 'text-white' : 'text-obsidian'} />
        <div className="mt-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-antique-gold/20 border border-antique-gold flex items-center justify-center">
            <span className="text-antique-gold font-serif text-sm font-medium">MS</span>
          </div>
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-obsidian'}`}>Mehul Solanki</p>
            <p className="text-antique-gold text-[9px] tracking-widest uppercase font-display">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 px-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-display px-4 mb-4">Command Center</p>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xs transition-all cursor-pointer text-left ${
              currentView === item.id
                ? 'bg-antique-gold/10 text-antique-gold border border-antique-gold/30'
                : isDark 
                  ? 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  : 'text-gray-600 hover:bg-black/5 hover:text-obsidian border border-transparent'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-xs font-display uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t ${isDark ? 'border-gold-900/40' : 'border-champagne'}`}>
        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer rounded-xs ${
            currentView === 'settings'
              ? 'bg-antique-gold/10 text-antique-gold border border-antique-gold/30'
              : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-obsidian'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs font-display uppercase tracking-widest">System Settings</span>
        </button>
      </div>
    </aside>
  );
}
