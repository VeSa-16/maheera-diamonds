import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, Database } from 'lucide-react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
}

export default function SettingsView({ theme }: SettingsViewProps) {
  const isDark = theme === 'dark';
  
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    currency: 'INR',
    twoFactorAuth: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);

  const handleRunDiagnostics = () => {
    setIsDiagnosing(true);
    setDiagnosisResult(null);
    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosisResult("All systems nominal. API and Database are synchronized with 0ms latency.");
      setTimeout(() => setDiagnosisResult(null), 5000);
    }, 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className={`space-y-8 animate-fade-in relative h-full ${isDark ? 'text-white' : 'text-obsidian'}`}>
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-serif font-light ${isDark ? 'text-white' : 'text-obsidian'}`}>System Settings</h2>
          <p className={`text-xs font-display tracking-widest uppercase mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Global preferences and security
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <form onSubmit={handleSave} className={`p-8 border rounded-xs ${isDark ? 'bg-obsidian border-white/10' : 'bg-white border-champagne shadow-xs'}`}>
            
            {/* General Settings */}
            <div className="mb-8">
              <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-antique-gold" /> Global Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-[10px] uppercase tracking-widest font-display mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Base Currency
                  </label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className={`w-full max-w-md p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="maintenanceMode" 
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="w-4 h-4 accent-antique-gold"
                  />
                  <div>
                    <label htmlFor="maintenanceMode" className={`text-sm block ${isDark ? 'text-white' : 'text-obsidian'}`}>
                      Maintenance Mode
                    </label>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Displays a "Check Back Soon" page to all public visitors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <hr className={`my-8 ${isDark ? 'border-white/10' : 'border-black/10'}`} />
            
            {/* Notifications */}
            <div className="mb-8">
              <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-antique-gold" /> Communications
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="emailNotifications" 
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    className="w-4 h-4 accent-antique-gold"
                  />
                  <div>
                    <label htmlFor="emailNotifications" className={`text-sm block ${isDark ? 'text-white' : 'text-obsidian'}`}>
                      Email Alerts for New Inquiries
                    </label>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Send a notification to the executive email when a new VIP clienteling request is made.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className={`my-8 ${isDark ? 'border-white/10' : 'border-black/10'}`} />
            
            {/* Security */}
            <div className="mb-8">
              <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-antique-gold" /> Security
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="twoFactorAuth" 
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                    className="w-4 h-4 accent-antique-gold"
                  />
                  <div>
                    <label htmlFor="twoFactorAuth" className={`text-sm block ${isDark ? 'text-white' : 'text-obsidian'}`}>
                      Require Two-Factor Authentication
                    </label>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Mandate 2FA for all administrative accounts entering the panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className={`px-8 py-3 font-display text-xs uppercase tracking-widest flex items-center gap-2 transition-colors ${
                  isDark ? 'bg-antique-gold text-obsidian hover:bg-[#b59659]' : 'bg-obsidian text-white hover:bg-obsidian/90'
                }`}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving Changes...' : 'Save Configuration'}
              </button>
              {saveSuccess && (
                <span className="text-[#25D366] text-xs font-medium animate-fade-in">
                  Settings updated successfully.
                </span>
              )}
            </div>

          </form>
        </div>

        {/* System Status Sidebar */}
        <div className="col-span-1">
          <div className={`p-6 border rounded-xs ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/10'}`}>
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-antique-gold" /> System Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-500/20">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>API Server</span>
                <span className="text-[10px] font-display uppercase tracking-widest text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded">Operational</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-500/20">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Database Cache</span>
                <span className="text-[10px] font-display uppercase tracking-widest text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded">Operational</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-500/20">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Backup</span>
                <span className={`text-[10px] font-display uppercase tracking-widest ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Today, 02:00 AM</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-500/20">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Version</span>
                <span className={`text-[10px] font-display uppercase tracking-widest ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>v2.1.4-beta</span>
              </div>
            </div>
            
            <button 
              onClick={handleRunDiagnostics}
              disabled={isDiagnosing}
              className={`w-full mt-6 py-2 text-xs font-display uppercase tracking-widest border transition-colors ${
              isDark ? 'border-white/20 hover:bg-white/5 text-white' : 'border-black/20 hover:bg-black/5 text-obsidian'
            } ${isDiagnosing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isDiagnosing ? 'Running Analysis...' : 'Run Diagnostics'}
            </button>
            {diagnosisResult && (
              <p className="mt-3 text-[10px] text-[#25D366] animate-fade-in text-center leading-relaxed">
                {diagnosisResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
