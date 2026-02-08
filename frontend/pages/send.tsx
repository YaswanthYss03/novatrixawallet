import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ChevronDown, Info } from 'lucide-react';
import { walletAPI, marketAPI, transactionAPI } from '@/lib/api';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  icon: string;
}

interface Network {
  name: string;
  gasFee: number;
  time: string;
}

export default function Send() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [gasFees, setGasFees] = useState<any>(null);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [showNetworkSelect, setShowNetworkSelect] = useState(false);
  const [prices, setPrices] = useState<any>(null);

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

  const networkMap: { [key: string]: string } = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    USDT: 'Ethereum',
    BNB: 'BNB Chain',
    MATIC: 'Polygon',
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
      const [walletResponse, pricesResponse, gasFeesResponse] = await Promise.all([
        walletAPI.getBalance(),
        marketAPI.getPrices(),
        marketAPI.getGasFees(),
      ]);

      const balances = walletResponse.data.balances;
      const pricesData = pricesResponse.data;
      setPrices(pricesData);
      setGasFees(gasFeesResponse.data);

      const tokensData: Token[] = Object.keys(balances)
        .filter((symbol) => balances[symbol] > 0)
        .map((symbol) => ({
          symbol,
          name: tokenNames[symbol],
          balance: balances[symbol],
          usdValue: balances[symbol] * (pricesData[symbol]?.usd || 0),
          icon: tokenIcons[symbol],
        }));

      setTokens(tokensData);
      if (tokensData.length > 0) {
        setSelectedToken(tokensData[0]);
        const network = networkMap[tokensData[0].symbol];
        setSelectedNetwork({
          name: network,
          gasFee: gasFeesResponse.data[network]?.average.fee || 0,
          time: gasFeesResponse.data[network]?.average.time || '~2 min',
        });
      }
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

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setShowTokenSelect(false);
    const network = networkMap[token.symbol];
    if (gasFees && gasFees[network]) {
      setSelectedNetwork({
        name: network,
        gasFee: gasFees[network].average.fee,
        time: gasFees[network].average.time,
      });
    }
  };

  const handleNetworkSelect = (networkName: string, speed: string) => {
    if (gasFees && gasFees[networkName]) {
      setSelectedNetwork({
        name: networkName,
        gasFee: gasFees[networkName][speed].fee,
        time: gasFees[networkName][speed].time,
      });
    }
    setShowNetworkSelect(false);
  };

  const handleMaxClick = () => {
    if (selectedToken) {
      setAmount(selectedToken.balance.toString());
    }
  };

  const handleSend = async () => {
    if (!selectedToken || !amount || !toAddress || !selectedNetwork) {
      alert('Please fill all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || amountNum > selectedToken.balance) {
      alert('Invalid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await transactionAPI.send({
        toAddress,
        token: selectedToken.symbol,
        amount: amountNum,
        network: selectedNetwork.name,
        gasFee: selectedNetwork.gasFee,
      });

      alert(`✅ Transaction successful!\nHash: ${response.data.transaction.hash}`);
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.msg || 'Transaction failed');
      setLoading(false);
    }
  };

  const totalUSD = selectedToken && amount
    ? parseFloat(amount) * (prices?.[selectedToken.symbol]?.usd || 0)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Send</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 space-y-4">
        {/* Token Selector */}
        <div>
          <label className="block text-text-secondary text-sm mb-2">Asset</label>
          <button
            onClick={() => setShowTokenSelect(!showTokenSelect)}
            className="w-full bg-card border border-gray-700 rounded-xl px-4 py-4 flex items-center justify-between"
          >
            {selectedToken ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                  {selectedToken.icon}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">{selectedToken.symbol}</p>
                  <p className="text-text-secondary text-sm">
                    Balance: {selectedToken.balance.toFixed(4)}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-text-secondary">Select token</span>
            )}
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Token Dropdown */}
          {showTokenSelect && (
            <div className="mt-2 bg-card border border-gray-700 rounded-xl overflow-hidden">
              {tokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {token.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold">{token.symbol}</p>
                    <p className="text-text-secondary text-sm">{token.balance.toFixed(4)}</p>
                  </div>
                  <p className="text-white">${token.usdValue.toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-text-secondary text-sm mb-2">To Address</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x... or wallet address"
            className="w-full bg-card border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-text-secondary text-sm mb-2">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-card border border-gray-700 rounded-xl px-4 py-4 text-white text-2xl font-semibold focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-black px-3 py-1 rounded-lg text-sm font-semibold"
            >
              MAX
            </button>
          </div>
          <p className="text-text-secondary text-sm mt-2">
            ≈ ${totalUSD.toFixed(2)} USD
          </p>
        </div>

        {/* Network Selector */}
        <div>
          <label className="block text-text-secondary text-sm mb-2">Network</label>
          <button
            onClick={() => setShowNetworkSelect(!showNetworkSelect)}
            className="w-full bg-card border border-gray-700 rounded-xl px-4 py-4 flex items-center justify-between"
          >
            {selectedNetwork ? (
              <div>
                <p className="text-white font-semibold">{selectedNetwork.name}</p>
                <p className="text-text-secondary text-sm">
                  Fee: ${selectedNetwork.gasFee.toFixed(2)} • {selectedNetwork.time}
                </p>
              </div>
            ) : (
              <span className="text-text-secondary">Select network</span>
            )}
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Network Dropdown */}
          {showNetworkSelect && selectedToken && gasFees && (
            <div className="mt-2 bg-card border border-gray-700 rounded-xl overflow-hidden">
              {Object.entries(gasFees[networkMap[selectedToken.symbol]] || {}).map(
                ([speed, data]: [string, any]) => (
                  <button
                    key={speed}
                    onClick={() => handleNetworkSelect(networkMap[selectedToken.symbol], speed)}
                    className="w-full px-4 py-3 hover:bg-gray-800 transition text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold capitalize">{speed}</p>
                        <p className="text-text-secondary text-sm">{data.time}</p>
                      </div>
                      <p className="text-white">${data.fee.toFixed(2)}</p>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {selectedToken && amount && selectedNetwork && (
          <div className="bg-card border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <p className="text-white text-sm font-semibold">Transaction Summary</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Amount</span>
              <span className="text-white">
                {amount} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Network Fee</span>
              <span className="text-white">${selectedNetwork.gasFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Estimated Time</span>
              <span className="text-white">{selectedNetwork.time}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
              <span className="text-white font-semibold">Total Cost</span>
              <span className="text-white font-semibold">
                ${(totalUSD + selectedNetwork.gasFee).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!selectedToken || !amount || !toAddress || loading}
          className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
