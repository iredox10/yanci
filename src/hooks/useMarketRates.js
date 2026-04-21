import { useState, useEffect } from 'react';

// Free APIs for Nigerian market data
const API_ENDPOINTS = {
  exchange: 'https://api.exchangerate-api.com/v4/latest/USD',
  crypto: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
};

const DEFAULT_RATES = {
  usdNgn: 1650,
  gbpNgn: 2100,
  eurNgn: 1800,
  btcUsd: 95000,
  ethUsd: 3500,
  brentCrude: 82.40,
  gold: 2040.10,
  dangote: 240.50,
};

export const useMarketRates = () => {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [changes, setChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchRates = async () => {
      try {
        // Fetch exchange rates
        const [exchangeRes, cryptoRes] = await Promise.allSettled([
          fetch(API_ENDPOINTS.exchange, { signal: AbortSignal.timeout(8000) }),
          fetch(API_ENDPOINTS.crypto, { signal: AbortSignal.timeout(8000) }),
        ]);

        if (!mounted) return;

        const newRates = { ...DEFAULT_RATES };

        if (exchangeRes.status === 'fulfilled' && exchangeRes.value.ok) {
          const data = await exchangeRes.value.json();
          if (data.rates?.NGN) newRates.usdNgn = data.rates.NGN;
          if (data.rates?.GBP) newRates.gbpNgn = data.rates.NGN * data.rates.GBP;
          if (data.rates?.EUR) newRates.eurNgn = data.rates.NGN * data.rates.EUR;
        }

        if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
          const data = await cryptoRes.value.json();
          if (data.bitcoin?.usd) newRates.btcUsd = data.bitcoin.usd;
          if (data.ethereum?.usd) newRates.ethUsd = data.ethereum.usd;
        }

        // Calculate changes from previous rates
        setChanges(prev => {
          const newChanges = {};
          Object.keys(newRates).forEach(key => {
            if (prev[key] !== undefined && prev[key] !== newRates[key]) {
              const pct = ((newRates[key] - prev[key]) / prev[key] * 100).toFixed(2);
              newChanges[key] = parseFloat(pct);
            }
          });
          return { ...prev, ...newChanges };
        });

        setRates(newRates);
        setLastUpdated(new Date());
        setError(null);
      } catch (e) {
        if (mounted) {
          console.warn('Market rates fetch failed, using defaults:', e.message);
          setError(e.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRates();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return { rates, changes, loading, lastUpdated, error };
};

export default useMarketRates;
