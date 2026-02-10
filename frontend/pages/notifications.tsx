import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Bell, Mail, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  priceAlerts: boolean;
  transactionAlerts: boolean;
  marketUpdates: boolean;
}

export default function Notifications() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    priceAlerts: true,
    transactionAlerts: true,
    marketUpdates: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/auth/notification-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      await api.put('/auth/notification-settings', newSettings);
      setSuccess('Settings updated!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert on error
      setSettings(settings);
    }
  };

  const notificationOptions = [
    {
      key: 'pushNotifications' as keyof NotificationSettings,
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      color: 'text-primary'
    },
    {
      key: 'emailNotifications' as keyof NotificationSettings,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive updates via email',
      color: 'text-blue-500'
    },
    {
      key: 'priceAlerts' as keyof NotificationSettings,
      icon: TrendingUp,
      title: 'Price Alerts',
      description: 'Get notified about significant price changes',
      color: 'text-green-500'
    },
    {
      key: 'transactionAlerts' as keyof NotificationSettings,
      icon: DollarSign,
      title: 'Transaction Alerts',
      description: 'Notifications for all transactions',
      color: 'text-yellow-500'
    },
    {
      key: 'marketUpdates' as keyof NotificationSettings,
      icon: MessageSquare,
      title: 'Market Updates',
      description: 'Daily market news and updates',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Notifications</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4">
        {/* Notification Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Bell className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500/50 rounded-xl px-4 py-3 text-green-500 text-sm">
            {success}
          </div>
        )}

        {/* Notification Settings */}
        <div className="space-y-3">
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.key}
                className="bg-card border border-gray-700 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`${option.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{option.title}</h3>
                    <p className="text-text-secondary text-sm">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(option.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[option.key] ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings[option.key] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-card border border-gray-700 rounded-xl p-4">
          <p className="text-text-secondary text-sm">
            <strong className="text-white">Note:</strong> You can customize your notification preferences at any time. We respect your choices and will only send notifications you've enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
