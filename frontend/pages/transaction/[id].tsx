import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Copy, ExternalLink, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTransaction();
    }
  }, [id]);

  // Separate effect for polling
  useEffect(() => {
    if (!transaction || transaction.status !== 'Processing') {
      return;
    }

    // Poll for status updates every 3 seconds if Processing
    const interval = setInterval(() => {
      fetchTransaction();
    }, 3000);

    return () => clearInterval(interval);
  }, [transaction?.status]);

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await axios.get(`${API_URL}/transaction/history`, {
        headers: { 'x-auth-token': token }
      });

      const tx = res.data.find((t: any) => t._id === id);
      if (tx) {
        setTransaction(tx);
      } else {
        setError('Transaction not found');
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch transaction error:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      
      setError('Failed to load transaction');
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    switch (transaction?.status) {
      case 'Success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'Processing':
        return <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />;
      case 'Failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'Pending':
        return <AlertCircle className="w-16 h-16 text-blue-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction?.status) {
      case 'Success':
        return 'from-green-500/20 to-green-500/5 border-green-500/30';
      case 'Processing':
        return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
      case 'Failed':
        return 'from-red-500/20 to-red-500/5 border-red-500/30';
      case 'Pending':
        return 'from-blue-500/20 to-blue-500/5 border-blue-500/30';
      default:
        return 'from-gray-500/20 to-gray-500/5 border-gray-500/30';
    }
  };

  const getTypeColor = () => {
    switch (transaction?.type) {
      case 'send':
        return 'text-red-600 bg-red-100';
      case 'receive':
        return 'text-green-600 bg-green-100';
      case 'swap':
        return 'text-purple-600 bg-purple-100';
      case 'stake':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4 text-lg">{error || 'Transaction not found'}</p>
          <p className="text-text-secondary text-sm mb-6">
            {error === 'Failed to load transaction' ? 'Please make sure you are logged in' : ''}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/history')}
              className="px-6 py-3 bg-primary text-black rounded-xl font-medium"
            >
              Back to History
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-card border border-gray-700 text-white rounded-xl font-medium"
            >
              Login
            </button>
          </div>
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
        <h1 className="text-white text-lg font-semibold">Transaction Details</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-6">
        {/* Status Card */}
        <div className={`bg-gradient-to-br ${getStatusColor()} border rounded-2xl p-8`}>
          <div className="flex flex-col items-center text-center">
            {getStatusIcon()}
            
            <h2 className="text-white text-2xl font-bold mt-6 mb-2">
              {transaction.status}
            </h2>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor()} mb-4`}>
              {transaction.type.toUpperCase()}
            </span>

            {/* Amount Display */}
            <div className="w-full bg-card/50 border border-gray-700 rounded-xl p-6">
              <p className="text-text-secondary text-sm mb-1">Amount</p>
              <p className="text-white text-3xl font-bold">
                {transaction.amount} {transaction.token}
              </p>
              {transaction.gasFee > 0 && (
                <p className="text-text-secondary text-sm mt-2">
                  Gas Fee: {transaction.gasFee} {transaction.token}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-card border border-gray-700 rounded-2xl p-4 space-y-4">
          <h3 className="text-white font-semibold mb-3">Transaction Information</h3>
          
          {/* Destination Address */}
          <div>
            <p className="text-text-secondary text-sm mb-2">
              {transaction.type === 'receive' ? 'From Address' : 'To Address'}
            </p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between">
              <p className="text-white text-sm font-mono truncate flex-1">{transaction.toAddress}</p>
              <button 
                onClick={() => copyToClipboard(transaction.toAddress)}
                className="ml-2 p-2 hover:bg-card rounded-lg"
              >
                <Copy className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Transaction Hash */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Transaction Hash</p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between">
              <p className="text-white text-sm font-mono truncate flex-1">{transaction.transactionHash}</p>
              <button 
                onClick={() => copyToClipboard(transaction.transactionHash)}
                className="ml-2 p-2 hover:bg-card rounded-lg"
              >
                <Copy className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Network */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Network</p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3">
              <p className="text-white text-sm">{transaction.network}</p>
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Date & Time</p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3">
              <p className="text-white text-sm">{formatDate(transaction.timestamp)}</p>
            </div>
          </div>

          {/* Status with real-time indicator */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Current Status</p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                {transaction.status === 'Processing' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-yellow-500 text-sm font-medium">Processing</p>
                    <span className="text-xs text-text-secondary">(Updates automatically)</span>
                  </>
                )}
                {transaction.status === 'Success' && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-500 text-sm font-medium">Completed</p>
                  </>
                )}
                {transaction.status === 'Failed' && (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-red-500 text-sm font-medium">Failed</p>
                  </>
                )}
                {transaction.status === 'Pending' && (
                  <>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-blue-500 text-sm font-medium">Pending</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* External Transaction Notice */}
          {transaction.isExternal && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">External Transfer</p>
                <p className="text-text-secondary text-xs">
                  This transaction is being sent to an external wallet. Processing time may vary.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Copy Notification */}
        {copied && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-black px-6 py-3 rounded-xl font-medium shadow-lg">
            Copied to clipboard!
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/history')}
            className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-primary/90 transition"
          >
            Back to History
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-card border border-gray-700 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
