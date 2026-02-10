import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminUsers() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data.users);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch users error:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        router.push('/admin/login');
      } else {
        setError('Failed to load users');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <button 
              onClick={() => router.push('/admin/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </button>
            <button 
              onClick={() => router.push('/admin/transactions')}
              className="text-gray-500 hover:text-gray-700"
            >
              Transactions
            </button>
            <button 
              onClick={() => router.push('/admin/users')}
              className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium"
            >
              Users
            </button>
            <button 
              onClick={() => router.push('/admin/activity')}
              className="text-gray-500 hover:text-gray-700"
            >
              Activity Log
            </button>
          </nav>
        </div>
      </div>

      {/* Users List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              All Users ({users.length})
            </h2>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No users found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
                          <p className="text-sm text-gray-500">User ID: {user.userId}</p>
                          {user.name && <p className="text-sm text-gray-600">Name: {user.name}</p>}
                          {user.mobile && <p className="text-sm text-gray-600">Mobile: {user.mobile}</p>}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Wallet Address</p>
                          <p className="text-sm font-mono text-gray-900 truncate">{user.walletAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Transactions</p>
                          <p className="text-sm font-semibold text-gray-900">{user.transactionCount}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Balances</p>
                        <div className="grid grid-cols-5 gap-3">
                          {Object.entries(user.balances).map(([token, balance]: [string, any]) => (
                            <div key={token} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500">{token}</p>
                              <p className="text-sm font-semibold text-gray-900">{balance.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
