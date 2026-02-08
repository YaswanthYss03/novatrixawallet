import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Copy, Share2, QrCode } from 'lucide-react';

export default function Receive() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const address = localStorage.getItem('walletAddress') || '0x0000...0000';
    setWalletAddress(address);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wallet Address',
        text: walletAddress,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Receive</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-6">
        {/* QR Code Placeholder */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-6 rounded-2xl mb-4">
            <div className="w-64 h-64 bg-gray-200 rounded-xl flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
          </div>
          <p className="text-text-secondary text-sm text-center">
            Scan this QR code to receive crypto
          </p>
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-text-secondary text-sm mb-2">
            Your Wallet Address
          </label>
          <div className="bg-card border border-gray-700 rounded-xl p-4 break-all">
            <p className="text-white font-mono text-sm">{walletAddress}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            {copied ? 'Copied!' : 'Copy Address'}
          </button>

          <button
            onClick={handleShare}
            className="w-full bg-card border border-gray-700 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Address
          </button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4">
          <p className="text-yellow-500 text-sm">
            ⚠️ <strong>Important:</strong> Only send crypto to this address on supported
            networks. Sending assets on unsupported networks may result in loss.
          </p>
        </div>

        {/* Supported Networks */}
        <div>
          <p className="text-white font-semibold mb-3">Supported Networks</p>
          <div className="space-y-2">
            {['Ethereum (ERC20)', 'BNB Chain (BEP20)', 'Polygon', 'Bitcoin'].map(
              (network) => (
                <div
                  key={network}
                  className="bg-card border border-gray-700 rounded-xl px-4 py-3"
                >
                  <p className="text-white text-sm">{network}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
