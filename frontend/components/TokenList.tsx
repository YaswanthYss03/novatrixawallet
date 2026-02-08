import { ChevronRight } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
}

interface TokenListProps {
  tokens: Token[];
  onTokenClick: (token: Token) => void;
}

const tokenIcons: { [key: string]: string } = {
  BTC: '₿',
  ETH: 'Ξ',
  USDT: '₮',
  BNB: '💎',
  MATIC: '⬡',
};

export default function TokenList({ tokens, onTokenClick }: TokenListProps) {
  return (
    <div className="px-4 pb-24">
      {tokens.map((token) => (
        <button
          key={token.symbol}
          onClick={() => onTokenClick(token)}
          className="w-full flex items-center justify-between py-4 border-b border-gray-800 card-hover text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
              {tokenIcons[token.symbol] || '●'}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">{token.symbol}</p>
              <p className="text-text-secondary text-sm">{token.name}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">
              ${token.usdValue.toFixed(2)}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-text-secondary text-sm">
                {token.balance.toFixed(4)} {token.symbol}
              </p>
              <p
                className={`text-sm ${
                  token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {token.change24h >= 0 ? '+' : ''}
                {token.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
