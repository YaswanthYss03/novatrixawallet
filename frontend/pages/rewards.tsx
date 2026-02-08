import { useRouter } from 'next/router';
import { ArrowLeft, Gift, TrendingUp, Zap } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Rewards() {
  const router = useRouter();

  const rewardPrograms = [
    {
      title: 'Staking Rewards',
      subtitle: 'Earn up to 12% APY',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: 'Referral Program',
      subtitle: 'Earn $10 per referral',
      icon: Gift,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'DeFi Yield',
      subtitle: 'Liquidity mining rewards',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Rewards</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-4">
        {/* Total Rewards */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 text-center">
          <p className="text-text-secondary text-sm mb-2">Total Rewards Earned</p>
          <p className="text-white text-4xl font-bold mb-2">$0.00</p>
          <p className="text-primary text-sm">Start earning today!</p>
        </div>

        {/* Reward Programs */}
        <div>
          <h2 className="text-white font-semibold mb-3">Available Programs</h2>
          <div className="space-y-3">
            {rewardPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <button
                  key={index}
                  className="w-full bg-card border border-gray-700 rounded-xl p-4 hover:border-primary transition"
                  onClick={() => router.push('/earn')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold">{program.title}</p>
                      <p className="text-text-secondary text-sm">{program.subtitle}</p>
                    </div>
                    <div className="text-primary font-semibold">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-card border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">More Rewards Coming Soon!</p>
          <p className="text-text-secondary text-sm">
            Check back regularly for new reward opportunities.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
