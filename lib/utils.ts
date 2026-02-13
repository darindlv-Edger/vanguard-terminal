import { Trade } from '@/types';

export const calculatePnL = (trade: Trade): number | null => {
    if (!trade.entry_price || !trade.exit_price) return null;

    const diff = trade.side === 'BUY'
        ? trade.exit_price - trade.entry_price
        : trade.entry_price - trade.exit_price;

    let multiplier = 1;

    // Determine multiplier based on symbol
    // NQ = 20, ES = 50
    // MNQ = 2, MES = 5
    // GC = 100, CL = 1000 (Standard implementation assumptions if not specified, but keeping to confirmed logic)

    const symbol = trade.symbol.toUpperCase();

    if (symbol === 'NQ') multiplier = 20;
    else if (symbol === 'ES') multiplier = 50;
    else if (symbol === 'MNQ') multiplier = 2;
    else if (symbol === 'MES') multiplier = 5;
    else if (symbol === 'CL') multiplier = 1000;
    else if (symbol === 'GC') multiplier = 100;
    else if (symbol.includes('BTC')) multiplier = 1; // Crypto usually 1:1 or specific contract size
    else if (symbol.includes('ETH')) multiplier = 1;

    return diff * multiplier * (trade.contracts || 1);
};
