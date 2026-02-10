import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminTransactions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await axios.get(`${API_URL}/admin/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTransactions(res.data.transactions);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch transactions error:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        router.push('/admin/login');
      } else {
        setError('Failed to load transactions');
        setLoading(false);
      }
    }
  };

  const updateStatus = async (transactionId: string, newStatus: string) => {
    setUpdatingId(transactionId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/admin/transaction/${transactionId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setTransactions(transactions.map(tx => 
        tx._id === transactionId ? { ...tx, status: newStatus } : tx
      ));
    } catch (err: any) {
      console.error('Update status error:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'text-green-600 bg-green-100';
      case 'Processing': return 'text-yellow-600 bg-yellow-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'send': return 'text-red-600 bg-red-50';
      case 'receive': return 'text-green-600 bg-green-50';
      case 'swap': return 'text-purple-600 bg-purple-50';
      case 'stake': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
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
              className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium"
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
              className="text-gray-500 hover:text-gray-700"
            >
              Activity Log
            </button>
          </nav>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              All Transactions ({transactions.length})
            </h2>
            <button 
              onClick={fetchTransactions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No transactions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">External</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.from}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tx.token}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {tx.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {tx.isExternal ? (
                          <span className="text-purple-600">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {tx.status === 'Processing' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateStatus(tx._id, 'Success')}
                              disabled={updatingId === tx._id}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs disabled:opacity-50"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateStatus(tx._id, 'Failed')}
                              disabled={updatingId === tx._id}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:opacity-50"
                            >
                              Fail
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
