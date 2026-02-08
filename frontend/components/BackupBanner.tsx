import { X } from 'lucide-react';
import Image from 'next/image';

export default function BackupBanner() {
  return (
    <div className="mx-4 mb-4 bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border border-yellow-600/50 rounded-2xl p-4 relative">
      <button className="absolute top-4 right-4 text-text-secondary hover:text-white">
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"></div>
          <div className="absolute inset-2 bg-card rounded-lg flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-2">
            Back up to secure your assets
          </h3>
          <button className="text-primary font-semibold flex items-center gap-1">
            Back up wallet →
          </button>
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full ${
              i === 5 ? 'w-6 bg-white' : 'w-1 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
