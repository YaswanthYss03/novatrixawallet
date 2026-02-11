import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WalletHeader from '@/components/WalletHeader';
import BalanceCard from '@/components/BalanceCard';
import ActionButtons from '@/components/ActionButtons';
import BackupBanner from '@/components/BackupBanner';
import Tabs from '@/components/Tabs';
import TokenList from '@/components/TokenList';
import BottomNav from '@/components/BottomNav';
import { walletAPI, marketAPI } from '@/lib/api';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Crypto');
  const [walletData, setWalletData] = useState<any>(null);
  const [prices, setPrices] = useState<any>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const tokenNames: { [key: string]: string } = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    USDT: 'Tether',
    BNB: 'BNB',
    MATIC: 'Polygon',
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, []);

  // Update prices every 10 seconds when on Watch tab
  useEffect(() => {
    if (activeTab !== 'Watch') return;
    
    const interval = setInterval(async () => {
      try {
        const pricesResponse = await marketAPI.getPrices();
        setPrices(pricesResponse.data);
        
        // Update allTokens with new prices
        if (walletData) {
          const balances = walletData.balances;
          const pricesData = pricesResponse.data;
          
          const updatedAllTokens: Token[] = Object.keys(tokenNames).map((symbol) => {
            const balance = balances[symbol] || 0;
            const price = pricesData[symbol]?.usd || 0;
            const change24h = pricesData[symbol]?.change24h || 0;

            return {
              symbol,
              name: tokenNames[symbol],
              balance,
              usdValue: balance * price,
              change24h,
              icon: '',
            };
          });
          
          setAllTokens(updatedAllTokens);
        }
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [activeTab, walletData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet balance and market prices in parallel
      const [walletResponse, pricesResponse] = await Promise.all([
        walletAPI.getBalance(),
        marketAPI.getPrices(),
      ]);

      setWalletData(walletResponse.data);
      setPrices(pricesResponse.data);

      // Calculate tokens with USD values
      const balances = walletResponse.data.balances;
      const pricesData = pricesResponse.data;

      const tokensData: Token[] = Object.keys(balances).map((symbol) => {
        const balance = balances[symbol];
        const price = pricesData[symbol]?.usd || 0;
        const change24h = pricesData[symbol]?.change24h || 0;

        return {
          symbol,
          name: tokenNames[symbol],
          balance,
          usdValue: balance * price,
          change24h,
          icon: '',
        };
      });

      // Create all tokens array for Prediction and Watch tabs
      const allTokensData: Token[] = Object.keys(tokenNames).map((symbol) => {
        const balance = balances[symbol] || 0;
        const price = pricesData[symbol]?.usd || 0;
        const change24h = pricesData[symbol]?.change24h || 0;

        return {
          symbol,
          name: tokenNames[symbol],
          balance,
          usdValue: balance * price,
          change24h,
          icon: '',
        };
      });

      // Filter out tokens with zero balance for Crypto tab
      const nonZeroTokens = tokensData.filter((token) => token.balance > 0);
      
      setTokens(nonZeroTokens);
      setAllTokens(allTokensData);

      // Calculate total balance
      const total = tokensData.reduce((sum, token) => sum + token.usdValue, 0);
      setTotalBalance(total);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // If unauthorized or not found (invalid token), redirect to login
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 404) {
        localStorage.clear(); // Clear all stored data
        router.push('/login');
      }
      setLoading(false);
    }
  };

  const handleTokenClick = (token: Token) => {
    router.push(`/token/${token.symbol}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <WalletHeader
        walletAddress={walletData?.walletAddress || '0x...'}
      />

      <BalanceCard totalBalance={totalBalance} />

      <ActionButtons
        onSend={() => router.push('/send')}
        onFund={() => router.push('/receive')}
        onSwap={() => router.push('/swap')}
        onSell={() => router.push('/history')}
        onEarn={() => router.push('/earn')}
      />

      <BackupBanner />

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'Crypto' && (
        tokens.length > 0 ? (
          <TokenList tokens={tokens} onTokenClick={handleTokenClick} />
        ) : (
          <div className="text-center py-12">
            <button
              onClick={() => router.push('/receive')}
              className="bg-primary text-black px-8 py-3 rounded-full font-semibold mb-4"
            >
              Fund your wallet
            </button>
            <p className="text-text-secondary text-sm">
              💎 Deposit from Binance available
            </p>
          </div>
        )
      )}

      {activeTab === 'Prediction' && (
        <div className="px-4 pb-24">
          <p className="text-text-secondary text-sm mb-4">AI-powered price predictions for the next 24 hours</p>
          {allTokens.map((token) => {
            const prediction = token.change24h + (Math.random() * 10 - 5);
            const confidence = 60 + Math.random() * 30;
            return (
              <button
                key={token.symbol}
                onClick={() => handleTokenClick(token)}
                className="w-full flex items-center justify-between py-4 border-b border-gray-800 card-hover text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {token.symbol === 'BTC' ? '₿' : token.symbol === 'ETH' ? 'Ξ' : token.symbol === 'USDT' ? '₮' : token.symbol === 'BNB' ? '💎' : '⬡'}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{token.symbol}</p>
                    <p className="text-text-secondary text-sm">{token.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-semibold ${prediction >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {prediction >= 0 ? '+' : ''}{prediction.toFixed(2)}%
                  </p>
                  <p className="text-text-secondary text-xs">
                    {confidence.toFixed(0)}% confidence
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'Watch' && (
        <div className="px-4 pb-24">
          <p className="text-text-secondary text-sm mb-4">Real-time market prices</p>
          {allTokens.map((token) => {
            const currentPrice = prices?.[token.symbol]?.usd || 0;
            return (
              <button
                key={token.symbol}
                onClick={() => handleTokenClick(token)}
                className="w-full flex items-center justify-between py-4 border-b border-gray-800 card-hover text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {token.symbol === 'BTC' ? '₿' : token.symbol === 'ETH' ? 'Ξ' : token.symbol === 'USDT' ? '₮' : token.symbol === 'BNB' ? '💎' : '⬡'}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{token.symbol}</p>
                    <p className="text-text-secondary text-sm">{token.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">
                    ${currentPrice.toLocaleString()}
                  </p>
                  <p className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
