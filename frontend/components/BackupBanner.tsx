import { useState, useEffect } from 'react';
import { X, Shield, Zap, Clock, HeadphonesIcon, Wallet, TrendingUp } from 'lucide-react';

const carouselItems = [
  {
    icon: '🎯',
    title: '99.9% Success Rate',
    description: 'Industry-leading transaction reliability',
    gradient: 'from-green-900/40 to-emerald-800/40',
    border: 'border-green-600/50',
    iconBg: 'from-green-500 to-emerald-500'
  },
  {
    icon: '🔐',
    title: 'Bank-Level Security',
    description: 'Your assets are protected 24/7',
    gradient: 'from-blue-900/40 to-blue-800/40',
    border: 'border-blue-600/50',
    iconBg: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Instant transactions worldwide',
    gradient: 'from-yellow-900/40 to-orange-800/40',
    border: 'border-yellow-600/50',
    iconBg: 'from-yellow-500 to-orange-500'
  },
  {
    icon: '🌐',
    title: 'Multi-Currency Support',
    description: 'BTC, ETH, USDT, BNB & more',
    gradient: 'from-purple-900/40 to-purple-800/40',
    border: 'border-purple-600/50',
    iconBg: 'from-purple-500 to-pink-500'
  },
  {
    icon: '📊',
    title: 'Real-Time Tracking',
    description: 'Live market prices & predictions',
    gradient: 'from-indigo-900/40 to-indigo-800/40',
    border: 'border-indigo-600/50',
    iconBg: 'from-indigo-500 to-blue-500'
  },
  {
    icon: '💎',
    title: 'Admin Verified',
    description: 'All external transactions approved',
    gradient: 'from-pink-900/40 to-rose-800/40',
    border: 'border-pink-600/50',
    iconBg: 'from-pink-500 to-rose-500'
  }
];

export default function BackupBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    }
  };

  if (!isVisible) return null;

  const currentItem = carouselItems[currentIndex];

  return (
    <div 
      className={`mx-4 mb-4 bg-gradient-to-r ${currentItem.gradient} border ${currentItem.border} rounded-2xl p-4 relative transition-all duration-500`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-text-secondary hover:text-white z-10"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentItem.iconBg} rounded-xl`}></div>
          <div className="absolute inset-2 bg-card rounded-lg flex items-center justify-center">
            <span className="text-2xl">{currentItem.icon}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">
            {currentItem.title}
          </h3>
          <p className="text-text-secondary text-sm">
            {currentItem.description}
          </p>
        </div>
      </div>
      
      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {carouselItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-6 bg-white' : 'w-1 bg-white/30'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

