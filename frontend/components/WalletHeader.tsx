import { Settings, Scan, ChevronDown, Copy, Search } from 'lucide-react';
import { useRouter } from 'next/router';

interface WalletHeaderProps {
  walletAddress: string;
}

export default function WalletHeader({ walletAddress }: WalletHeaderProps) {
  const router = useRouter();
  
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <button 
        onClick={() => router.push('/settings')}
        className="p-2 hover:bg-card rounded-lg transition"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      <div className="w-10"></div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => router.push('/receive')}
          className="p-2 hover:bg-card rounded-lg transition"
        >
          <Scan className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={() => router.push('/market')}
          className="p-2 hover:bg-card rounded-lg transition"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      </div>
    </header>
  );
}

