import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Clock, CheckCircle, AlertCircle, Copy, ArrowLeft, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Processing() {
  const router = useRouter();
  const { hash, amount, token, to, status: initialStatus, txId } = router.query;
  
  const [status, setStatus] = useState(initialStatus as string || 'Processing');
  const [copied, setCopied] = useState(false);

  // Poll for status updates every 3 seconds if status is Processing
  useEffect(() => {
    if (status === 'Processing' && hash) {
      const interval = setInterval(async () => {
        try {
          const userToken = localStorage.getItem('token');
          if (!userToken) return;

          const res = await axios.get(`${API_URL}/transaction/history`, {
            headers: { 'x-auth-token': userToken }
          });

          const transaction = res.data.transactions.find((tx: any) => 
            tx.transactionHash === hash
          );

          if (transaction && transaction.status !== status) {
            setStatus(transaction.status);
            if (transaction.status === 'Success' || transaction.status === 'Failed') {
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error('Error checking status:', err);
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [status, hash]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Processing':
        return <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />;
      case 'Success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'Failed':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Processing':
        return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
      case 'Success':
        return 'from-green-500/20 to-green-500/5 border-green-500/30';
      case 'Failed':
        return 'from-red-500/20 to-red-500/5 border-red-500/30';
      default:
        return 'from-gray-500/20 to-gray-500/5 border-gray-500/30';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'Processing':
        return 'Your transaction is being processed. This may take a few minutes.';
      case 'Success':
        return 'Your transaction has been completed successfully!';
      case 'Failed':
        return 'Your transaction has failed. Please try again or contact support.';
      default:
        return 'Processing your transaction...';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.push('/')} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Transaction Status</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-6">
        {/* Status Card */}
        <div className={`bg-gradient-to-br ${getStatusColor()} border rounded-2xl p-8`}>
          <div className="flex flex-col items-center text-center">
            {getStatusIcon()}
            
            <h2 className="text-white text-2xl font-bold mt-6 mb-2">
              {status === 'Processing' ? 'Processing Transaction' : status === 'Success' ? 'Transaction Complete' : 'Transaction Failed'}
            </h2>
            
            <p className="text-text-secondary text-sm mb-6">
              {getStatusMessage()}
            </p>

            {/* Amount Display */}
            <div className="w-full bg-card/50 border border-gray-700 rounded-xl p-6 mb-4">
              <p className="text-text-secondary text-sm mb-1">Amount</p>
              <p className="text-white text-3xl font-bold">
                {amount} {token}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-card border border-gray-700 rounded-2xl p-4 space-y-4">
          <h3 className="text-white font-semibold mb-3">Transaction Details</h3>
          
          {/* Destination Address */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Destination Address</p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between">
              <p className="text-white text-sm font-mono truncate flex-1">{to || 'N/A'}</p>
              <button 
                onClick={() => copyToClipboard(to as string)}
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
              <p className="text-white text-sm font-mono truncate flex-1">{hash || 'Pending...'}</p>
              {hash && (
                <button 
                  onClick={() => copyToClipboard(hash as string)}
                  className="ml-2 p-2 hover:bg-card rounded-lg"
                >
                  <Copy className="w-4 h-4 text-text-secondary" />
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Status</p>
            <div className="bg-background border border-gray-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                {status === 'Processing' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-yellow-500 text-sm font-medium">Processing</p>
                  </>
                )}
                {status === 'Success' && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-500 text-sm font-medium">Completed</p>
                  </>
                )}
                {status === 'Failed' && (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-red-500 text-sm font-medium">Failed</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* External Transaction Notice */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-medium mb-1">External Transfer</p>
              <p className="text-text-secondary text-xs">
                This transaction is being sent to an external wallet. Processing time may vary depending on network conditions.
              </p>
            </div>
          </div>
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
            View Transaction History
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-card border border-gray-700 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>

        {/* Help Text */}
        {status === 'Processing' && (
          <div className="text-center">
            <p className="text-text-secondary text-xs">
              Need help? Check your transaction history or contact support if processing takes longer than expected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
