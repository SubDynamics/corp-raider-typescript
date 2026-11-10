import { UPGRADE_MULTIPLIER } from './const';
import type { PortfolioItem } from './const';

const MILLION = 1000000;
const BILLION = 1000000000;
const TRILLION = 1000000000000;
const THOUSAND = 1000;
const HUNDRED = 100;
const SIGN = '$';

const getTwoDigitDecimal = (amount: number): number => {
  return Math.floor(amount * HUNDRED) / HUNDRED;
};

const numberWithCommas = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const moneyFormatter = (amount: number, withNewLine?: boolean): string => {
  const space = withNewLine ? '\n' : ' ';
  if (amount >= TRILLION) {
    return SIGN + getTwoDigitDecimal(amount / TRILLION) + space + 'TRILLION';
  } else if (amount >= BILLION) {
    return SIGN + getTwoDigitDecimal(amount / BILLION) + space + 'BILLION';
  } else if (amount >= MILLION) {
    return SIGN + getTwoDigitDecimal(amount / MILLION) + space + 'MILLION';
  } else if (amount >= THOUSAND) {
    return SIGN + numberWithCommas(amount);
  }
  return SIGN + amount;
};

const countdownLeadingZero = (secondCount: number): string => {
  if (secondCount < 10) return '0' + secondCount;
  return secondCount.toString();
};

export const countdownFormatter = (deltaSecs: number): string => {
  if (deltaSecs < 0) return '00:00:00';
  const hours = Math.floor((deltaSecs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((deltaSecs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((deltaSecs % (1000 * 60)) / 1000);
  return countdownLeadingZero(hours) + ':' + countdownLeadingZero(minutes) + ':' + countdownLeadingZero(seconds);
};

export const calculatePayout = (portfolioObject: PortfolioItem): number => {
  const { isUpgraded, payout, branchCount } = portfolioObject;
  const payoutPerBranch = isUpgraded ? payout * UPGRADE_MULTIPLIER : payout;
  return payoutPerBranch * branchCount;
};

export const getFitScale = (
  viewportWidth: number,
  viewportHeight: number,
  contentWidth: number,
  contentHeight: number,
): number => {
  const widthScale = viewportWidth / contentWidth;
  return contentHeight * widthScale > viewportHeight ? viewportHeight / contentHeight : widthScale;
};
