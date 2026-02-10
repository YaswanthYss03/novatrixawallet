import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, mobile: string) =>
    api.post('/auth/register', { email, password, mobile }),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  updateBalance: (token: string, amount: number) =>
    api.put('/wallet/balance', { token, amount }),
};

// Market API
export const marketAPI = {
  getPrices: () => api.get('/market/prices'),
  getGasFees: () => api.get('/market/gas-fees'),
  getChartData: (symbol: string, timeframe: string) => 
    api.get(`/market/chart/${symbol}?timeframe=${timeframe}`),
};

// Transaction API
export const transactionAPI = {
  send: (data: {
    toAddress: string;
    token: string;
    amount: number;
    network: string;
    gasFee: number;
  }) => api.post('/transaction/send', data),
  swap: (data: {
    fromToken: string;
    toToken: string;
    fromAmount: number;
    toAmount: number;
    network: string;
    gasFee: number;
  }) => api.post('/transaction/swap', data),
  getHistory: () => api.get('/transaction/history'),
};
