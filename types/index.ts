export interface Trade {
    id: string;
    user_id: string;
    account_id: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    entry_price: number;
    exit_price: number | null;
    contracts: number;
    strategy: string;
    image_urls: string[] | null;
    created_at: string;
}

export interface UserSettings {
    user_id: string;
    current_account_id: string;
    firm_name: string;
    profit_target: number;
    max_loss: number;
    is_funded: boolean;
}

export type ContractType = 'MINI' | 'MICRO';
