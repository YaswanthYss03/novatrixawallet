import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { marketAPI } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

interface MarketToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
}

export default function Market() {
  const router = useRouter();
  const [prices, setPrices] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tokenNames: { [key: string]: string } = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    USDT: 'Tether',
    BNB: 'BNB',
    MATIC: 'Polygon',
  };

  const tokenIcons: { [key: string]: string } = {
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮',
    BNB: '💎',
    MATIC: '⬡',
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await marketAPI.getPrices();
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const marketTokens: MarketToken[] = prices
    ? Object.keys(prices).map((symbol) => ({
        symbol,
        name: tokenNames[symbol],
        price: prices[symbol].usd,
        change24h: prices[symbol].change24h,
        volume: (prices[symbol].usd * 1000000 * Math.random()).toFixed(0),
        marketCap: (prices[symbol].usd * 10000000 * Math.random()).toFixed(0),
      }))
    : [];

  const filteredTokens = marketTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenClick = (symbol: string) => {
    router.push(`/token/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Market</h1>
        <div className="w-10"></div>
      </header>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cryptocurrencies..."
            className="w-full bg-card border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Market List */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-semibold">All Cryptocurrencies</h2>
          <p className="text-text-secondary text-sm">{filteredTokens.length} assets</p>
        </div>

        <div className="space-y-2">
          {filteredTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => handleTokenClick(token.symbol)}
              className="w-full bg-card border border-gray-700 rounded-xl p-4 card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {tokenIcons[token.symbol]}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{token.name}</p>
                    <p className="text-text-secondary text-sm">{token.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">
                    ${token.price.toLocaleString()}
                  </p>
                  <div
                    className={`flex items-center gap-1 justify-end ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {token.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {Math.abs(token.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
