import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { walletAPI, marketAPI, transactionAPI } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TokenDetail() {
  const router = useRouter();
  const { symbol } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [prices, setPrices] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [timeframe, setTimeframe] = useState('1D');
  const [activeTab, setActiveTab] = useState('Holdings');
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [loadingChart, setLoadingChart] = useState(false);

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
    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      fetchChartData();
    }
  }, [symbol, timeframe]);

  const fetchData = async () => {
    try {
      const [walletResponse, pricesResponse] = await Promise.all([
        walletAPI.getBalance(),
        marketAPI.getPrices(),
      ]);

      const balances = walletResponse.data.balances;
      const pricesData = pricesResponse.data;
      
      setPrices(pricesData);
      setBalance(balances[symbol as string] || 0);
      
      const tokenPrice = pricesData[symbol as string];
      setTokenData({
        symbol,
        name: tokenNames[symbol as string],
        price: tokenPrice?.usd || 0,
        change24h: tokenPrice?.change24h || 0,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // If unauthorized or not found (invalid token), redirect to login
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 404) {
        localStorage.clear();
        router.push('/login');
      }
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    if (!symbol) return;
    
    setLoadingChart(true);
    try {
      const response = await marketAPI.getChartData(symbol as string, timeframe);
      const prices = response.data.prices;
      
      if (prices && prices.length > 0) {
        setChartData(formatChartData(prices));
      }
      setLoadingChart(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoadingChart(false);
      // Keep existing chart data or show error
    }
  };

  const formatChartData = (prices: any[]) => {
    if (!prices || prices.length === 0) return null;

    // Determine how to format labels based on timeframe
    let labels: string[] = [];
    const data: number[] = [];

    prices.forEach((item, index) => {
      const date = new Date(item.time);
      data.push(item.value);

      if (timeframe === '1H') {
        labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      } else if (timeframe === '1D') {
        labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit' }));
      } else if (timeframe === '1W') {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else if (timeframe === '1M') {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      } else if (timeframe === '1Y') {
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      } else {
        labels.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
      }
    });

    // Calculate if overall trend is up or down
    const firstPrice = data[0];
    const lastPrice = data[data.length - 1];
    const isPositive = lastPrice >= firstPrice;

    return {
      labels,
      datasets: [
        {
          label: symbol as string,
          data: data,
          borderColor: isPositive ? '#00D982' : '#FF3B30',
          backgroundColor: isPositive ? 'rgba(0, 217, 130, 0.1)' : 'rgba(255, 59, 48, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: isPositive ? '#00D982' : '#FF3B30',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#1A1B1F',
        titleColor: '#FFF',
        bodyColor: '#FFF',
        borderColor: '#3A3B3F',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return '$' + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">Token not found</p>
      </div>
    );
  }

  const usdBalance = balance * tokenData.price;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-white text-xl font-bold">{tokenData.symbol}</h1>
          <p className="text-text-secondary text-xs">COIN | {tokenData.name}</p>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 hover:bg-card rounded-lg"
        >
          <Star
            className={`w-6 h-6 ${isFavorite ? 'fill-primary text-primary' : 'text-white'}`}
          />
        </button>
      </header>

      {/* Balance Indicator */}
      <div className="px-6 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
        <span className="text-primary text-base font-bold">
          ${balance.toFixed(2)}
        </span>
      </div>

      {/* Price */}
      <div className="text-center py-6 px-4">
        <h2 className="text-white text-5xl font-bold mb-3">
          ${tokenData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div
          className={`flex items-center justify-center gap-2 ${
            tokenData.change24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {tokenData.change24h >= 0 ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
          <span className="text-base font-semibold">
            ${Math.abs(tokenData.change24h * tokenData.price / 100).toFixed(2)} (
            {tokenData.change24h >= 0 ? '+' : ''}
            {tokenData.change24h.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 mb-4">
        <div className="h-64 mb-4 relative">
          {loadingChart ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-text-secondary">No chart data available</p>
            </div>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center gap-2">
          {['1H', '1D', '1W', '1M', '1Y', 'All'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                timeframe === tf
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-text-secondary'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      
      <div className="px-4 mb-6">
        <div className="flex gap-6 border-b border-gray-800">
          {['Holdings', 'History', 'About', 'Insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold relative transition-colors ${
                activeTab === tab ? 'text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'Holdings' && (
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">My Balance</h3>
            <div className="bg-card border border-gray-700 rounded-2xl p-5 flex items-center justify-between hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {tokenIcons[tokenData.symbol]}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">{tokenData.name}</p>
                  <p className="text-text-secondary text-sm font-medium">
                    {balance.toFixed(8)} {tokenData.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">${usdBalance.toFixed(2)}</p>
                <p className="text-text-secondary text-xs mt-1">-</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'History' && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No transaction history yet</p>
          </div>
        )}

        {activeTab === 'About' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">About {tokenData.name}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tokenData.symbol === 'BTC' && 'Bitcoin is the first decentralized cryptocurrency. It is a digital currency that operates without a central bank or single administrator.'}
                {tokenData.symbol === 'ETH' && 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.'}
                {tokenData.symbol === 'USDT' && 'Tether is a stablecoin cryptocurrency that is pegged to the US dollar, maintaining a 1:1 ratio.'}
                {tokenData.symbol === 'BNB' && 'BNB is the cryptocurrency coin that powers the BNB Chain ecosystem. It is used for transaction fees and can be traded for other cryptocurrencies.'}
                {tokenData.symbol === 'MATIC' && 'Polygon (MATIC) is a protocol and framework for building and connecting Ethereum-compatible blockchain networks.'}
              </p>
            </div>
            <div className="bg-card border border-gray-700 rounded-xl p-4">
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">Market Cap</span>
                <span className="text-white font-semibold">
                  ${(tokenData.price * 19000000 * Math.random()).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">24h Volume</span>
                <span className="text-white font-semibold">
                  ${(tokenData.price * 1000000 * Math.random()).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Insights' && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Insights coming soon</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-gray-800 px-4 py-5 shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { label: 'Send', icon: '↗', onClick: () => router.push('/send') },
            { label: 'Receive', icon: '↓', onClick: () => router.push('/receive') },
            { label: 'Swap', icon: '⇄', onClick: () => router.push('/swap') },
            { label: 'Sell', icon: '🏛', onClick: () => router.push('/swap') },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 bg-gray-800 group-hover:bg-gray-700"
              >
                <span className="text-xl text-white">
                  {action.icon}
                </span>
              </div>
              <span className="text-white text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
