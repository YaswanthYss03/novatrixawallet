import { useRouter } from 'next/router';
import { ArrowLeft, ExternalLink, Newspaper, GraduationCap, LineChart } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Discover() {
  const router = useRouter();

  const categories = [
    {
      title: 'DeFi',
      description: 'Decentralized Finance',
      icon: LineChart,
      color: 'from-blue-500 to-cyan-500',
      items: 3,
    },
    {
      title: 'News',
      description: 'Latest crypto updates',
      icon: Newspaper,
      color: 'from-purple-500 to-pink-500',
      items: 5,
    },
    {
      title: 'Learn',
      description: 'Educational content',
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-500',
      items: 7,
    },
  ];

  const featured = [
    {
      title: 'Understanding DeFi',
      subtitle: 'A beginner\'s guide',
      tag: 'Learn',
    },
    {
      title: 'Bitcoin Hits New High',
      subtitle: 'Market analysis',
      tag: 'News',
    },
    {
      title: 'Staking Explained',
      subtitle: 'Earn passive income',
      tag: 'DeFi',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Discover</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-2">
            Explore the World of Crypto
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Learn, trade, and grow your portfolio with confidence
          </p>
          <button className="bg-primary text-black px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transition">
            Get Started
          </button>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-white font-semibold mb-3">Categories</h2>
          <div className="grid grid-cols-1 gap-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className="bg-card border border-gray-700 rounded-xl p-4 hover:border-primary transition"
                  onClick={() => router.push('/market')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold">{category.title}</p>
                      <p className="text-text-secondary text-sm">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-semibold">{category.items}</p>
                      <p className="text-text-secondary text-xs">Articles</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Content */}
        <div>
          <h2 className="text-white font-semibold mb-3">Featured Articles</h2>
          <div className="space-y-3">
            {featured.map((item, index) => (
              <button
                key={index}
                className="w-full bg-card border border-gray-700 rounded-xl p-4 hover:border-primary transition"
                onClick={() => router.push('/market')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary text-xs font-semibold bg-primary/20 px-2 py-1 rounded">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-white font-semibold mb-1">{item.title}</p>
                    <p className="text-text-secondary text-sm">{item.subtitle}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-text-secondary flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
