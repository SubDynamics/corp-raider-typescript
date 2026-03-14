import { PORTFOLIO_STORAGE_PREFIX, businessesForSale } from './const';
import type { PortfolioItem } from './const';

export const CLICK_INCOME_STORAGE_KEY = 'playerClickIncome';

export interface RestoredGameData {
  playerClickIncome: string | null;
  playerPortfolio: PortfolioItem[];
}

const addLeadingZeroes = (numberVal: number): string => {
  if (numberVal < 10) {
    return '00' + numberVal;
  } else if (numberVal < 100) {
    return '0' + numberVal;
  }
  return numberVal.toString();
};

export const saveToLocalStorage = (storageKey: string, storageValue: string | number): void => {
  window.localStorage.setItem(storageKey, String(storageValue));
};

export const saveClickIncome = (newValue: number): void => {
  saveToLocalStorage(CLICK_INCOME_STORAGE_KEY, newValue);
};

export const savePortfolioItem = (portfolioIndex: number, portfolioItem: PortfolioItem): void => {
  if (portfolioItem) {
    const storageKeyIndex = addLeadingZeroes(portfolioIndex);
    const keyName = PORTFOLIO_STORAGE_PREFIX + storageKeyIndex;
    const valueString = JSON.stringify(portfolioItem);
    saveToLocalStorage(keyName, valueString);
  }
};

/**
 * retrieveGameFromStorage
 * @returns RestoredGameData
 */
export const retrieveGameFromStorage = (): RestoredGameData => {
  const restoredData: RestoredGameData = {
    playerClickIncome: window.localStorage.getItem(CLICK_INCOME_STORAGE_KEY),
    playerPortfolio: [],
  };

  for (let i = 0; i < businessesForSale.length; i++) {
    const storageKeyIndex = addLeadingZeroes(i);
    const keyName = PORTFOLIO_STORAGE_PREFIX + storageKeyIndex;
    const retrievedItem = window.localStorage.getItem(keyName);
    if (retrievedItem) {
      restoredData.playerPortfolio[i] = JSON.parse(retrievedItem) as PortfolioItem;
    }
  }

  return restoredData;
};
