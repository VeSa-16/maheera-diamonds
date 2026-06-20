import { useState } from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import AdminSidebar, { AdminView } from './components/AdminSidebar';
import CRMView from './views/CRMView';
import AnalyticsView from './views/AnalyticsView';
import CatalogueView from './views/CatalogueView';
import SettingsView from './views/SettingsView';
import CustomizerEngineView from './views/CustomizerEngineView';
import AdminLogisticsView from './views/AdminLogisticsView';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('analytics');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isDark = theme === 'dark';

  const renderView = () => {
    switch (currentView) {
      case 'crm':
        return <CRMView theme={theme} />;
      case 'analytics':
        return <AnalyticsView theme={theme} />;
      case 'catalogue':
        return <CatalogueView theme={theme} />;
      case 'settings':
        return <SettingsView theme={theme} />;
      case 'customizer':
        return <CustomizerEngineView theme={theme} />;
      case 'logistics':
        return <AdminLogisticsView theme={theme} />;
      default:
        return (
          <div className={`flex flex-col items-center justify-center h-full font-sans ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className={`text-xl font-serif mb-2 ${isDark ? 'text-white' : 'text-obsidian'}`}>Module Under Construction</p>
            <p className="text-sm">The {currentView} module is scheduled for a future update.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors ${isDark ? 'bg-obsidian text-white' : 'bg-warm-ivory text-obsidian'}`}>
      {/* Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        userRole="Executive Director"
        theme={theme}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className={`h-[88px] border-b px-8 flex items-center justify-between sticky top-0 backdrop-blur-md z-40 transition-colors ${isDark ? 'border-gold-900/40 bg-obsidian/95' : 'border-champagne bg-warm-ivory/95'}`}>
          <div>
            <h1 className={`font-serif text-2xl tracking-widest font-light uppercase ${isDark ? 'text-white' : 'text-obsidian'}`}>
              {currentView === 'analytics' && 'Executive Analytics'}
              {currentView === 'crm' && 'VIP Clienteling'}
              {currentView === 'customizer' && 'Customizer Engine'}
              {currentView === 'catalogue' && 'Salon Curation'}
              {currentView === 'logistics' && 'Armored Transit'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${isDark ? 'border-white/10 text-stone-400 hover:text-white hover:bg-white/10' : 'border-black/10 text-stone-500 hover:text-obsidian hover:bg-black/5'}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onLogout}
              className={`flex items-center gap-2 text-[10px] font-display uppercase tracking-widest transition-colors cursor-pointer ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-obsidian'}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect Session
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className={`flex-1 p-8 transition-colors ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]'}`}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
