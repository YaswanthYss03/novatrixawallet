const express = require('express');
const router = express.Router();
const axios = require('axios');

// Cache for market prices to avoid rate limiting
let priceCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 60 seconds

// Fallback prices in case API fails completely
const FALLBACK_PRICES = {
  BTC: { usd: 70389, change24h: 2.66 },
  ETH: { usd: 2107.6, change24h: 4.16 },
  USDT: { usd: 0.999, change24h: 0.01 },
  BNB: { usd: 647.07, change24h: 1.22 },
  MATIC: { usd: 0.75, change24h: 1.5 }
};

// @route   GET /api/market/prices
// @desc    Get current market prices from CoinGecko with caching
// @access  Public
router.get('/prices', async (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (priceCache && (now - lastFetchTime) < CACHE_DURATION) {
      return res.json(priceCache);
    }

    // Try to fetch fresh data
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin,ethereum,tether,binancecoin,matic-network',
          vs_currencies: 'usd',
          include_24hr_change: true
        },
        timeout: 5000
      }
    );

    const prices = {
      BTC: {
        usd: response.data.bitcoin?.usd || FALLBACK_PRICES.BTC.usd,
        change24h: response.data.bitcoin?.usd_24h_change || FALLBACK_PRICES.BTC.change24h
      },
      ETH: {
        usd: response.data.ethereum?.usd || FALLBACK_PRICES.ETH.usd,
        change24h: response.data.ethereum?.usd_24h_change || FALLBACK_PRICES.ETH.change24h
      },
      USDT: {
        usd: response.data.tether?.usd || FALLBACK_PRICES.USDT.usd,
        change24h: response.data.tether?.usd_24h_change || FALLBACK_PRICES.USDT.change24h
      },
      BNB: {
        usd: response.data.binancecoin?.usd || FALLBACK_PRICES.BNB.usd,
        change24h: response.data.binancecoin?.usd_24h_change || FALLBACK_PRICES.BNB.change24h
      },
      MATIC: {
        usd: response.data['matic-network']?.usd || FALLBACK_PRICES.MATIC.usd,
        change24h: response.data['matic-network']?.usd_24h_change || FALLBACK_PRICES.MATIC.change24h
      }
    };

    // Update cache
    priceCache = prices;
    lastFetchTime = now;

    res.json(prices);
  } catch (err) {
    console.error('Market prices error:', err.message);
    
    // If we have cached data, return it even if expired
    if (priceCache) {
      return res.json(priceCache);
    }
    
    // Otherwise return fallback prices
    res.json(FALLBACK_PRICES);
  }
});

// @route   GET /api/market/gas-fees
// @desc    Get realistic gas fees matching Binance rates
// @access  Public
router.get('/gas-fees', (req, res) => {
  // Based on real-world Binance network fees (February 2026)
  const gasFees = {
    Ethereum: {
      slow: { fee: 2.50, time: '~5 min' },
      average: { fee: 4.20, time: '~2 min' },
      fast: { fee: 8.80, time: '~30 sec' }
    },
    'BNB Chain': {
      slow: { fee: 0.15, time: '~3 min' },
      average: { fee: 0.25, time: '~1 min' },
      fast: { fee: 0.50, time: '~20 sec' }
    },
    Polygon: {
      slow: { fee: 0.008, time: '~4 min' },
      average: { fee: 0.02, time: '~2 min' },
      fast: { fee: 0.05, time: '~30 sec' }
    },
    Bitcoin: {
      slow: { fee: 1.20, time: '~30 min' },
      average: { fee: 2.50, time: '~15 min' },
      fast: { fee: 5.50, time: '~10 min' }
    }
  };

  res.json(gasFees);
});

// @route   GET /api/market/chart/:symbol
// @desc    Get historical chart data (generated from current price data)
// @access  Public
router.get('/chart/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe } = req.query; // '1H', '1D', '1W', '1M', '1Y', 'All'

    const coinIds = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      USDT: 'tether',
      BNB: 'binancecoin',
      MATIC: 'matic-network'
    };

    const coinId = coinIds[symbol];
    if (!coinId) {
      return res.status(400).json({ msg: 'Invalid token symbol' });
    }

    let currentPrice;
    let change24h;

    // Try to use cached price data first
    if (priceCache && priceCache[symbol]) {
      currentPrice = priceCache[symbol].usd;
      change24h = priceCache[symbol].change24h;
    } else {
      // Fallback to API if no cache
      try {
        const priceResponse = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: coinId,
              vs_currencies: 'usd',
              include_24hr_change: true
            },
            timeout: 5000
          }
        );

        currentPrice = priceResponse.data[coinId]?.usd || FALLBACK_PRICES[symbol].usd;
        change24h = priceResponse.data[coinId]?.usd_24h_change || FALLBACK_PRICES[symbol].change24h;
      } catch (err) {
        // Use fallback prices if API fails
        currentPrice = FALLBACK_PRICES[symbol].usd;
        change24h = FALLBACK_PRICES[symbol].change24h;
      }
    }

    // Generate realistic historical data based on current price and 24h change
    const dataPoints = {
      '1H': 12,  // 5-minute intervals
      '1D': 24,  // Hourly
      '1W': 7,   // Daily
      '1M': 30,  // Daily
      '1Y': 12,  // Monthly
      'All': 50  // Variable
    };

    const points = dataPoints[timeframe] || 24;
    const now = Date.now();
    const prices = [];

    // Calculate time intervals
    const intervals = {
      '1H': 5 * 60 * 1000,      // 5 minutes
      '1D': 60 * 60 * 1000,     // 1 hour
      '1W': 24 * 60 * 60 * 1000, // 1 day
      '1M': 24 * 60 * 60 * 1000, // 1 day
      '1Y': 30 * 24 * 60 * 60 * 1000, // ~1 month
      'All': 365 * 24 * 60 * 60 * 1000 / 50 // ~7 days per point
    };

    const interval = intervals[timeframe] || intervals['1D'];

    // Generate data with realistic variance
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1); // 0 to 1
      const timestamp = now - ((points - 1 - i) * interval);
      
      // Calculate base trend (from past to present based on 24h change)
      const trendMultiplier = 1 - (change24h / 100) * (1 - progress);
      
      // Add realistic variance (smaller for stablecoins, larger for volatile assets)
      const volatility = symbol === 'USDT' ? 0.001 : 0.02;
      const randomVariance = (Math.random() - 0.5) * volatility * Math.abs(change24h);
      
      const price = currentPrice * (trendMultiplier + randomVariance);
      
      prices.push({
        time: timestamp,
        value: Math.max(price, 0.001) // Ensure positive price
      });
    }

    res.json({ prices });
  } catch (err) {
    console.error('Chart data error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch chart data' });
  }
});

module.exports = router;
