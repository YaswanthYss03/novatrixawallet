import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, User, Shield, Bell, Globe, Moon, LogOut, ChevronRight, LucideIcon } from 'lucide-react';

interface SettingItem {
  label: string;
  icon: LucideIcon;
  value?: string;
  onClick: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function Settings() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');
    setUserId(storedUserId || '');
    setEmail(storedEmail || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const settingsSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: User, onClick: () => router.push('/profile/edit') },
        { label: 'Security', icon: Shield, onClick: () => router.push('/security') },
        { label: 'Notifications', icon: Bell, onClick: () => router.push('/notifications') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Settings</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-black" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{userId || 'User'}</p>
              <p className="text-text-secondary text-sm">{email || 'user@wallet.com'}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/history')}
            className="w-full bg-primary/20 text-primary border border-primary/30 py-2 rounded-xl font-semibold hover:bg-primary/30 transition"
          >
            View Transaction History
          </button>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <div key={index}>
            <h2 className="text-white font-semibold mb-3">{section.title}</h2>
            <div className="bg-card border border-gray-700 rounded-xl overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-800 transition border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-text-secondary" />
                      <span className="text-white">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-text-secondary text-sm">{item.value}</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* About */}
        <div>
          <h2 className="text-white font-semibold mb-3">About</h2>
          <div className="bg-card border border-gray-700 rounded-xl px-4 py-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-text-secondary">Version</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-text-secondary">Build</span>
              <span className="text-white">20260208</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/20 border border-red-500/50 text-red-500 font-semibold py-4 rounded-xl hover:bg-red-500/30 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
