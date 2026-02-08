import { useRouter } from 'next/router';
import { ArrowLeft, TrendingUp, Wallet, Percent, Shield } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Earn() {
  const router = useRouter();

  const earnOptions = [
    {
      title: 'Staking',
      subtitle: 'Lock tokens to earn rewards',
      apy: '12.5%',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      tokens: ['ETH', 'MATIC', 'BNB'],
    },
    {
      title: 'Liquidity Mining',
      subtitle: 'Provide liquidity to earn fees',
      apy: '25.8%',
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
      tokens: ['ETH', 'USDT'],
    },
    {
      title: 'Lending',
      subtitle: 'Lend your crypto to earn interest',
      apy: '8.3%',
      icon: Percent,
      color: 'from-orange-500 to-red-500',
      tokens: ['USDT', 'BTC'],
    },
    {
      title: 'Savings',
      subtitle: 'Safe earnings with stablecoins',
      apy: '5.0%',
      icon: Shield,
      color: 'from-cyan-500 to-blue-500',
      tokens: ['USDT'],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Earn</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 text-center">
          <h2 className="text-white text-2xl font-bold mb-2">
            Start Earning Today
          </h2>
          <p className="text-text-secondary mb-4">
            Make your crypto work for you with up to 25% APY
          </p>
          <div className="text-center">
            <p className="text-text-secondary text-sm mb-1">Estimated Annual Earnings</p>
            <p className="text-primary text-4xl font-bold">$0.00</p>
          </div>
        </div>

        {/* Earn Options */}
        <div>
          <h2 className="text-white font-semibold mb-3">Earning Options</h2>
          <div className="space-y-3">
            {earnOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  className="w-full bg-card border border-gray-700 rounded-xl p-4 hover:border-primary transition"
                  onClick={() => router.push('/discover')}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white font-semibold">{option.title}</p>
                        <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-bold">
                          {option.apy} APY
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm mb-2">{option.subtitle}</p>
                      
                      <div className="flex gap-2">
                        {option.tokens.map((token) => (
                          <span
                            key={token}
                            className="bg-gray-800 text-text-secondary px-2 py-1 rounded text-xs font-semibold"
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-text-secondary text-sm mb-1">Total Staked</p>
            <p className="text-white text-2xl font-bold">$0.00</p>
          </div>
          <div className="bg-card border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-text-secondary text-sm mb-1">Total Earned</p>
            <p className="text-primary text-2xl font-bold">$0.00</p>
          </div>
        </div>

        {/* How it Works */}
        <div>
          <h2 className="text-white font-semibold mb-3">How It Works</h2>
          <div className="bg-card border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">Choose an option</p>
                <p className="text-text-secondary text-sm">
                  Select the earning method that fits your goals
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">Deposit your crypto</p>
                <p className="text-text-secondary text-sm">
                  Lock or provide liquidity with your tokens
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">Start earning</p>
                <p className="text-text-secondary text-sm">
                  Watch your rewards grow automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
