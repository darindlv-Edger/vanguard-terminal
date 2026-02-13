// types/index.ts (or types.ts)

export interface Trade {
  id: string;
  user_id: string;
  account_id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  contracts: number;
  entry_price: number;
  exit_price: number | null;
  created_at: string;
  // THESE ARE THE MISSING KEYS CAUSING YOUR ERROR:
  is_playbook_valid: boolean; 
  rules_checked: string[] | null;
  image_urls?: string[];
  strategy?: string;
  notes?: string;
}

export interface UserSettings {
  user_id: string;
  firm_name: string;
  profit_target: number;
  max_loss: number;
  is_funded: boolean;
  current_account_id: string;
}