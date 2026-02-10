import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, User, Mail, Phone, Save } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });

  const [hasMobile, setHasMobile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('Fetching profile with token...');
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { 'x-auth-token': token }
      });

      console.log('Profile response:', res.data);

      // Add safety checks for response data
      if (res.data) {
        setFormData({
          name: res.data.name || '',
          mobile: res.data.mobile || '',
          email: res.data.email || ''
        });
        setHasMobile(res.data.mobile && res.data.mobile.trim().length > 0);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch profile error:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_URL}/user/profile`,
        {
          name: formData.name,
          mobile: formData.mobile
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/settings');
      }, 1500);
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.msg || 'Failed to update profile');
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Edit Profile</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4">
        {/* Profile Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-black" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              Email Address
            </label>
            <div className="bg-card border border-gray-700 rounded-xl px-4 py-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-text-secondary" />
              <input
                type="email"
                value={formData.email}
                disabled
                placeholder="Loading email..."
                className="flex-1 bg-transparent text-white outline-none"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">Email cannot be changed</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              Full Name *
            </label>
            <div className="bg-card border border-gray-700 rounded-xl px-4 py-4 flex items-center gap-3 focus-within:border-primary">
              <User className="w-5 h-5 text-text-secondary" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="flex-1 bg-transparent text-white outline-none placeholder-text-secondary"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              Mobile Number {!hasMobile && '*'}
            </label>
            <div className={`bg-card border border-gray-700 rounded-xl px-4 py-4 flex items-center gap-3 ${!hasMobile ? 'focus-within:border-primary' : ''}`}>
              <Phone className="w-5 h-5 text-text-secondary" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={hasMobile ? "" : "Enter your mobile number"}
                disabled={hasMobile}
                required={!hasMobile}
                className={`flex-1 bg-transparent ${hasMobile ? 'text-gray-500' : 'text-white'} outline-none placeholder-text-secondary`}
              />
            </div>
            {hasMobile && (
              <p className="text-xs text-text-secondary mt-1">Mobile number cannot be changed</p>
            )}
            {!hasMobile && (
              <p className="text-xs text-yellow-500 mt-1">Please add your mobile number (required)</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
