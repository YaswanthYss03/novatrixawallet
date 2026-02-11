import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ArrowDownUp, Settings, Info } from 'lucide-react';
import { walletAPI, marketAPI, transactionAPI } from '@/lib/api';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  icon: string;
}

export default function Swap() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [prices, setPrices] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFromTokenSelect, setShowFromTokenSelect] = useState(false);
  const [showToTokenSelect, setShowToTokenSelect] = useState(false);

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
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletResponse, pricesResponse] = await Promise.all([
        walletAPI.getBalance(),
        marketAPI.getPrices(),
      ]);

      const balances = walletResponse.data.balances;
      const pricesData = pricesResponse.data;
      setPrices(pricesData);

      const tokensData: Token[] = Object.keys(balances).map((symbol) => ({
        symbol,
        name: tokenNames[symbol],
        balance: balances[symbol],
        usdValue: balances[symbol] * (pricesData[symbol]?.usd || 0),
        icon: tokenIcons[symbol],
      }));

      setTokens(tokensData);
      
      // Set default tokens
      const ethToken = tokensData.find((t) => t.symbol === 'ETH');
      const usdtToken = tokensData.find((t) => t.symbol === 'USDT');
      if (ethToken) setFromToken(ethToken);
      if (usdtToken) setToToken(usdtToken);
    } catch (error) {
      console.error('Error fetching data:', error);
      // If unauthorized or not found (invalid token), redirect to login
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 404) {
        localStorage.clear();
        router.push('/login');
      }
    }
  };

  const calculateToAmount = (amount: string) => {
    if (!fromToken || !toToken || !amount || !prices) return '0';
    
    const fromPrice = prices[fromToken.symbol]?.usd || 0;
    const toPrice = prices[toToken.symbol]?.usd || 0;
    
    if (toPrice === 0) return '0';
    
    const fromValue = parseFloat(amount) * fromPrice;
    const toValue = fromValue / toPrice;
    
    // Apply slippage
    const slippagePercent = parseFloat(slippage) / 100;
    const result = toValue * (1 - slippagePercent);
    
    return result.toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setToAmount('');
  };

  const handleSelectFromToken = (token: Token) => {
    setFromToken(token);
    setShowFromTokenSelect(false);
    setFromAmount('');
    setToAmount('');
  };

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    setShowToTokenSelect(false);
    setFromAmount('');
    setToAmount('');
  };

  const handleMaxClick = () => {
    if (fromToken) {
      const maxAmount = fromToken.balance.toString();
      setFromAmount(maxAmount);
      setToAmount(calculateToAmount(maxAmount));
    }
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) {
      alert('Please fill all fields');
      return;
    }

    const amount = parseFloat(fromAmount);
    if (amount <= 0 || amount > fromToken.balance) {
      alert('Invalid amount');
      return;
    }

    setLoading(true);
    
    try {
      // Determine network based on token
      const networkMap: { [key: string]: string } = {
        BTC: 'Bitcoin',
        ETH: 'Ethereum',
        USDT: 'Ethereum',
        BNB: 'BNB Chain',
        MATIC: 'Polygon',
      };

      const network = networkMap[fromToken.symbol] || 'Ethereum';
      const gasFee = estimatedGas;

      const response = await transactionAPI.swap({
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount: amount,
        toAmount: parseFloat(toAmount),
        network,
        gasFee,
      });

      alert(`✅ Swap successful!\n${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Swap error:', error);
      const errorMsg = error.response?.data?.msg || 'Swap failed';
      alert(`❌ ${errorMsg}`);
      setLoading(false);
    }
  };

  const estimatedGas = 0.05; // Simulated gas fee

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Swap</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-card rounded-lg"
        >
          <Settings className="w-6 h-6 text-white" />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-card border border-gray-700 rounded-xl p-4 space-y-3">
            <p className="text-white font-semibold">Swap Settings</p>
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                Slippage Tolerance
              </label>
              <div className="flex gap-2">
                {['0.1', '0.5', '1.0'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSlippage(val)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      slippage === val
                        ? 'bg-primary text-black'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 text-white text-center focus:outline-none focus:border-primary"
                  placeholder="Custom"
                />
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="bg-card border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-sm">From</span>
            <span className="text-text-secondary text-sm">
              Balance: {fromToken?.balance.toFixed(4) || '0.00'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {fromToken && (
              <button
                onClick={() => setShowFromTokenSelect(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {fromToken.icon}
                </div>
                <span className="text-white font-semibold">{fromToken.symbol}</span>
                <span className="text-text-secondary">▼</span>
              </button>
            )}
            
            <div className="flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-white text-2xl font-semibold focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleMaxClick}
              className="bg-primary text-black px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
            >
              MAX
            </button>
          </div>
          
          {fromToken && fromAmount && prices && (
            <p className="text-text-secondary text-sm mt-2">
              ≈ ${(parseFloat(fromAmount) * prices[fromToken.symbol]?.usd).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="bg-card border-4 border-background p-3 rounded-xl hover:bg-gray-800 transition"
          >
            <ArrowDownUp className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-card border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-sm">To (estimated)</span>
            <span className="text-text-secondary text-sm">
              Balance: {toToken?.balance.toFixed(4) || '0.00'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {toToken && (
              <button
                onClick={() => setShowToTokenSelect(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {toToken.icon}
                </div>
                <span className="text-white font-semibold">{toToken.symbol}</span>
                <span className="text-text-secondary">▼</span>
              </button>
            )}
            
            <div className="flex-1">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="w-full bg-transparent text-white text-2xl font-semibold focus:outline-none"
              />
            </div>
          </div>
          
          {toToken && toAmount && prices && (
            <p className="text-text-secondary text-sm mt-2">
              ≈ ${(parseFloat(toAmount) * prices[toToken.symbol]?.usd).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Swap Details */}
        {fromToken && toToken && fromAmount && toAmount && (
          <div className="bg-card border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <p className="text-white text-sm font-semibold">Swap Details</p>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Rate</span>
              <span className="text-white">
                1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Slippage Tolerance</span>
              <span className="text-white">{slippage}%</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Network Fee</span>
              <span className="text-white">~${estimatedGas.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Minimum Received</span>
              <span className="text-white">
                {(parseFloat(toAmount) * 0.99).toFixed(6)} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !fromAmount || loading}
          className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Swapping...' : 'Swap'}
        </button>
      </div>

      {/* From Token Selection Modal */}
      {showFromTokenSelect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-card w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Select Token</h2>
              <button
                onClick={() => setShowFromTokenSelect(false)}
                className="text-text-secondary hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              {tokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleSelectFromToken(token)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition ${
                    fromToken?.symbol === token.symbol
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {token.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">{token.symbol}</p>
                      <p className="text-text-secondary text-sm">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{token.balance.toFixed(4)}</p>
                    <p className="text-text-secondary text-sm">${token.usdValue.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* To Token Selection Modal */}
      {showToTokenSelect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-card w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Select Token</h2>
              <button
                onClick={() => setShowToTokenSelect(false)}
                className="text-text-secondary hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              {tokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleSelectToToken(token)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition ${
                    toToken?.symbol === token.symbol
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {token.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">{token.symbol}</p>
                      <p className="text-text-secondary text-sm">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{token.balance.toFixed(4)}</p>
                    <p className="text-text-secondary text-sm">${token.usdValue.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
