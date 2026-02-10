import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const params = filter !== 'all' ? `?type=${filter}` : '';
      const res = await axios.get(`${API_URL}/admin/activity${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActivities(res.data.activities);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch activity error:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        router.push('/admin/login');
      } else {
        setError('Failed to load activity log');
        setLoading(false);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'send': return 'text-red-600 bg-red-50 border-red-200';
      case 'receive': return 'text-green-600 bg-green-50 border-green-200';
      case 'swap': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'stake': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'text-green-600';
      case 'Processing': return 'text-yellow-600';
      case 'Failed': return 'text-red-600';
      case 'Pending': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity log...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
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
              className="text-gray-500 hover:text-gray-700"
            >
              Users
            </button>
            <button 
              onClick={() => router.push('/admin/activity')}
              className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium"
            >
              Activity Log
            </button>
          </nav>
        </div>
      </div>

      {/* Filter and Activity List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('send')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'send' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sends
          </button>
          <button
            onClick={() => setFilter('receive')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'receive' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Receives
          </button>
          <button
            onClick={() => setFilter('swap')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'swap' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Swaps
          </button>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity ({activities.length})
            </h2>
            <button 
              onClick={fetchActivities}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : activities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No activity found</div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div 
                    key={activity._id} 
                    className={`border rounded-lg p-4 ${getTypeColor(activity.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                          <span className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                          {activity.isExternal && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              External
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">User</p>
                            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                            {activity.userName && activity.userName !== 'N/A' && (
                              <p className="text-xs text-gray-500">{activity.userName}</p>
                            )}
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Amount</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {activity.amount.toLocaleString()} {activity.token}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <p className="text-xs text-gray-600">Destination</p>
                            <p className="text-sm font-mono text-gray-700 truncate">{activity.to}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Transaction Hash</p>
                            <p className="text-xs font-mono text-gray-600 truncate">{activity.hash}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Timestamp</p>
                            <p className="text-xs text-gray-600">{formatDate(activity.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
