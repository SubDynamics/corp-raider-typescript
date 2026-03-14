import {
  businessesForSale,
  DEFAULT_ZERO,
  PORTFOLIO_DEFAULT_VALUES,
  BUSINESS_DISPLAY_COUNT,
} from './const';
import type { PortfolioItem } from './const';
import { calculatePayout } from './util';
import {
  saveClickIncome,
  savePortfolioItem,
  retrieveGameFromStorage,
} from './saveGame';

export let playerPortfolio: PortfolioItem[];

export let playerWallet: number;

export let playerClickIncome = 0;

export const newGame = (): void => {
  playerPortfolio = [
    {
      ...businessesForSale[DEFAULT_ZERO],
      ...PORTFOLIO_DEFAULT_VALUES,
    },
  ];
  const EMPTY_WALLET = 0;
  playerWallet = EMPTY_WALLET;
  playerClickIncome = EMPTY_WALLET;
};

export const addIncome = (
  portfolioIndex: number,
  isClickIncome: boolean,
  managerCycleCount?: number
): void => {
  if (portfolioIndex !== undefined && playerPortfolio[portfolioIndex]) {
    const singlePayoutTotal = calculatePayout(playerPortfolio[portfolioIndex]);
    const MINIMUM_MANAGER_CYCLES = 1;

    if (managerCycleCount && managerCycleCount >= MINIMUM_MANAGER_CYCLES) {
      playerWallet += singlePayoutTotal * managerCycleCount;
    } else {
      if (isClickIncome) {
        playerClickIncome += singlePayoutTotal;
        saveClickIncome(playerClickIncome);
      }
      playerWallet += singlePayoutTotal;
    }
  }
};

export const chargePlayerWallet = (amount: number): void => {
  if (amount) {
    playerWallet -= amount;
    if (playerWallet < playerClickIncome) {
      playerClickIncome = playerWallet;
      saveClickIncome(playerClickIncome);
    }
  }
};

export const buyBusiness = (businessIndex: number): void => {
  if (
    businessIndex !== undefined &&
    playerWallet >= businessesForSale[businessIndex].cost
  ) {
    if (playerPortfolio[businessIndex]) {
      playerPortfolio[businessIndex].branchCount++;
    } else {
      playerPortfolio[businessIndex] = {
        ...businessesForSale[businessIndex],
        branchCount: 1,
        isUpgraded: false,
        hasManager: false,
        managerHireTime: -1,
      };
    }
    chargePlayerWallet(businessesForSale[businessIndex].cost);
    savePortfolioItem(businessIndex, playerPortfolio[businessIndex]);
  }
};

export const upgradeBusiness = (portfolioIndex: number): void => {
  const { isUpgraded, upgradeCost } = playerPortfolio[portfolioIndex];
  if (!isUpgraded && playerWallet >= upgradeCost) {
    playerPortfolio[portfolioIndex].isUpgraded = true;
    savePortfolioItem(portfolioIndex, playerPortfolio[portfolioIndex]);
    chargePlayerWallet(upgradeCost);
  }
};

export const hireManager = (portfolioIndex: number): void => {
  const { hasManager, managerCost } = playerPortfolio[portfolioIndex];
  if (!hasManager && playerWallet >= managerCost) {
    playerPortfolio[portfolioIndex].hasManager = true;
    playerPortfolio[portfolioIndex].managerHireTime = Date.now();
    savePortfolioItem(portfolioIndex, playerPortfolio[portfolioIndex]);
    chargePlayerWallet(managerCost);
  }
};

export const calculateManagerIncome = (
  portfolioIndex: number,
  testTime?: number
): void => {
  const { payoutDelay, managerHireTime } = playerPortfolio[portfolioIndex];
  const nowTime = testTime ?? Date.now();
  const timeDelta = nowTime - managerHireTime;
  const payoutCount = Math.floor(timeDelta / payoutDelay);
  addIncome(portfolioIndex, false, payoutCount);
};

export const restoreGameFromStorage = (): void => {
  const retrievedGame = retrieveGameFromStorage();
  if (retrievedGame.playerClickIncome) {
    const incomeNumber = Number(retrievedGame.playerClickIncome);
    playerClickIncome += incomeNumber;
    playerWallet += incomeNumber;
  }

  if (retrievedGame.playerPortfolio.length) {
    playerPortfolio = retrievedGame.playerPortfolio;

    for (let i = 0; i < BUSINESS_DISPLAY_COUNT; i++) {
      if (playerPortfolio[i] && playerPortfolio[i].hasManager) {
        calculateManagerIncome(i);
      }
    }
  }
};
