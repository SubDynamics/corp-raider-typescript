export const DEFAULT_ZERO = 0;
export const UPGRADE_MULTIPLIER = 3;
export const ONE_DAY_MS = 86400000;
export const PORTFOLIO_STORAGE_PREFIX = 'portfolioItem_';
export const COOKIE_KEY = 'corp-raider-game-scoring';
export const MIDDLE_VAL = 0.5;
export const BUSINESS_DISPLAY_COUNT = 10;

export const GAME_COLORS = {
  textGreen: 0x8cc63f,
  textOrange: 0xfbb03b,
};

export interface BusinessForSale {
  name: string;
  cost: number;
  payout: number;
  payoutDelay: number;
  upgradeCost: number;
  managerCost: number;
}

export interface PortfolioItem extends BusinessForSale {
  branchCount: number;
  isUpgraded: boolean;
  hasManager: boolean;
  managerHireTime: number;
}

export interface AssetEntry {
  name: string;
  path: string;
}

export const PORTFOLIO_DEFAULT_VALUES = {
  branchCount: 1,
  isUpgraded: false,
  hasManager: false,
  managerHireTime: -1,
};

export const businessesForSale: BusinessForSale[] = [
  { name: '3 Card Monte', cost: 4, payout: 1, payoutDelay: 2000, upgradeCost: 20, managerCost: 20 },
  { name: 'Pinball Machine', cost: 72, payout: 18, payoutDelay: 8000, upgradeCost: 5000, managerCost: 13666 },
  { name: 'Ice Cream Truck', cost: 823, payout: 100, payoutDelay: 27000, upgradeCost: 250000, managerCost: 99000 },
  { name: 'Penny Stock Brokerage', cost: 4149, payout: 500, payoutDelay: 86000, upgradeCost: 500000, managerCost: 450000 },
  { name: 'Liquor Store', cost: 30700, payout: 1000, payoutDelay: 200000, upgradeCost: 1000000, managerCost: 1333000 },
  { name: 'Traveling Carnival', cost: 619000, payout: 3000, payoutDelay: 400000, upgradeCost: 5000000, managerCost: 66700000 },
  { name: 'Strip Mall', cost: 3540000, payout: 3000, payoutDelay: 800000, upgradeCost: 10000000, managerCost: 230000000 },
  { name: 'Garbage Truck Fleet', cost: 26000000, payout: 12000, payoutDelay: 1600000, upgradeCost: 20000000, managerCost: 575000000 },
  { name: 'Mall Video Game Chain', cost: 700000000, payout: 12000, payoutDelay: 3600000, upgradeCost: 40000000, managerCost: 1675309000 },
  { name: 'Casino', cost: 2000000000, payout: 12000000, payoutDelay: 5400000, upgradeCost: 80000000, managerCost: 11000000000 },
];

export const NEW_GAME_PORTFOLIO: PortfolioItem[] = [
  {
    ...businessesForSale[DEFAULT_ZERO],
    branchCount: 1,
    isUpgraded: false,
    hasManager: false,
    managerHireTime: -1,
  },
];

export const ASSET_LIST: AssetEntry[] = [
  { name: 'businessSpriteBG', path: 'assets/business_bg_corp_raider.png' },
  { name: 'buyButtonDisabled', path: 'assets/buy_button_disabled.png' },
  { name: 'buyButtonEnabled', path: 'assets/buy_button_enabled.png' },
  { name: 'gameBackground', path: 'assets/corp_raider_background.png' },
  { name: 'earnButtonDisabled', path: 'assets/earn_button_disabled.png' },
  { name: 'earnButtonEnabled', path: 'assets/earn_button_enabled.png' },
  { name: 'menuButton', path: 'assets/menu_button_corp_raider.png' },
  { name: 'timer', path: 'assets/timer_bg_corp_raider.png' },
  { name: 'wallet', path: 'assets/wallet_display_corp_raider.png' },
  { name: 'widgetManagerBtn', path: 'assets/widget_manager_mode.png' },
  { name: 'widgetUpgradeBtn', path: 'assets/widget_upgrade_mode.png' },
];
