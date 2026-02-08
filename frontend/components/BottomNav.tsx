import { Clock, TrendingUp, Repeat, Gift, Compass } from 'lucide-react';
import { useRouter } from 'next/router';

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { label: 'Home', icon: Clock, path: '/', active: true },
    { label: 'Trending', icon: TrendingUp, path: '/market', active: false },
    { label: 'Trade', icon: Repeat, path: '/swap', active: false },
    { label: 'Rewards', icon: Gift, path: '/rewards', active: false },
    { label: 'Discover', icon: Compass, path: '/discover', active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-800 px-4 py-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1"
            >
              {item.label === 'Trade' ? (
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-8 shadow-lg">
                  <Icon className="w-7 h-7 text-black" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-primary' : 'text-text-secondary'
                    }`}
                    strokeWidth={2}
                  />
                  <span
                    className={`text-xs ${
                      isActive ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
