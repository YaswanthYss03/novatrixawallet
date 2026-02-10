import { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '@/lib/api';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate mobile number
    if (!mobile || mobile.trim().length === 0) {
      setError('Mobile number is required');
      setLoading(false);
      return;
    }

    if (mobile.length < 10) {
      setError('Please enter a valid mobile number');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(email, password, mobile);
      
      // Store user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('walletAddress', response.data.walletAddress);
      localStorage.setItem('userEmail', email);
      
      // Redirect to home
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Nova Trixa Logo" 
              className="w-24 h-24 rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-text-secondary">Join Novatrixa Wallet</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-card border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Create password (min 6 characters)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-card border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-text-secondary mb-4">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-primary hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-card/50 border border-gray-700 rounded-xl">
          <p className="text-xs text-text-secondary text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
            Your wallet address will be automatically generated.
          </p>
        </div>
      </div>
    </div>
  );
}
