import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, User, Mail, Phone, Save } from 'lucide-react';
import { api } from '@/lib/api';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        mobile: response.data.mobile || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/auth/profile', {
        name: formData.name,
        mobile: formData.mobile
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Profile</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4">
        {/* Profile Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-black" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-card border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="email"
                value={formData.email}
                className="w-full bg-card/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-text-secondary focus:outline-none cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">Email cannot be changed</p>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-card border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="+1234567890"
                pattern="[+]?[0-9]{10,15}"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">Optional - Include country code</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-xl px-4 py-3 text-green-500 text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Info Card */}
        <div className="mt-6 bg-card border border-gray-700 rounded-xl p-4">
          <p className="text-text-secondary text-sm">
            <strong className="text-white">Privacy Note:</strong> Your personal information is stored securely and will never be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
