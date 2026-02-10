import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { transactionAPI } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

interface Transaction {
  _id: string;
  token: string;
  amount: number;
  toAddress: string;
  network: string;
  gasFee: number;
  status: string;
  transactionHash: string;
  timestamp: string;
}

export default function History() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const tokenIcons: { [key: string]: string } = {
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮',
    BNB: '💎',
    MATIC: '⬡',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getHistory();
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Transaction History</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-text-secondary" />
            </div>
            <p className="text-white font-semibold mb-2">No transactions yet</p>
            <p className="text-text-secondary text-sm mb-6">
              Your transaction history will appear here
            </p>
            <button
              onClick={() => router.push('/send')}
              className="bg-primary text-black px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              Send Crypto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-card border border-gray-700 rounded-xl p-4 card-hover cursor-pointer"
                onClick={() => router.push(`/transaction/${tx._id}`)}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {tokenIcons[tx.token] || '●'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-white font-semibold">Send {tx.token}</p>
                      <p className="text-white font-semibold">-{tx.amount}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-text-secondary text-sm">
                        To {shortenAddress(tx.toAddress)}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {formatDate(tx.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          tx.status === 'Success'
                            ? 'bg-green-500/20 text-green-500'
                            : tx.status === 'Pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {tx.status}
                      </span>
                      <span className="text-text-secondary text-xs">
                        {tx.network}
                      </span>
                      <span className="text-text-secondary text-xs">
                        Fee: ${tx.gasFee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-text-secondary text-xs font-mono">
                    {shortenHash(tx.transactionHash)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
