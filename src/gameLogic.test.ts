import { describe, it, expect, beforeEach } from 'vitest';
import {
  newGame,
  playerWallet,
  playerPortfolio,
  playerClickIncome,
  addIncome,
  chargePlayerWallet,
  buyBusiness,
  upgradeBusiness,
  hireManager,
  calculateManagerIncome,
} from '../src/gameLogic';
import { businessesForSale } from '../src/const';

beforeEach(() => {
  newGame();
});

describe('newGame', () => {
  it('should initialise the player wallet to 0', () => {
    expect(playerWallet).toBe(0);
  });
  it('should initialise playerClickIncome to 0', () => {
    expect(playerClickIncome).toBe(0);
  });
  it('should initialise playerPortfolio with one business', () => {
    expect(playerPortfolio.length).toBe(1);
  });
});

describe('addIncome', () => {
  it('should increase playerWallet by the payout of the business at portfolioIndex', () => {
    addIncome(0, false);
    expect(playerWallet).toBe(playerPortfolio[0].payout);
  });
  it('should increase playerWallet by payout * managerCycleCount when managerCycleCount is provided', () => {
    addIncome(0, false, 5);
    expect(playerWallet).toBe(playerPortfolio[0].payout * 5);
  });
  it('should not change playerWallet when portfolioIndex is out of range', () => {
    addIncome(9, false);
    expect(playerWallet).toBe(0);
  });
});

describe('chargePlayerWallet', () => {
  it('should deduct amount from playerWallet', () => {
    addIncome(0, false, 10);
    const walletBefore = playerWallet;
    chargePlayerWallet(1);
    expect(playerWallet).toBe(walletBefore - 1);
  });
});

describe('buyBusiness', () => {
  it('should not buy a business if wallet is insufficient', () => {
    buyBusiness(1);
    expect(playerPortfolio[1]).toBeUndefined();
  });
  it('should buy a business and add it to portfolio when wallet is sufficient', () => {
    addIncome(0, false, 10000);
    buyBusiness(1);
    expect(playerPortfolio[1]).toBeDefined();
    expect(playerPortfolio[1].branchCount).toBe(1);
  });
  it('should increment branchCount when buying a business already in portfolio', () => {
    addIncome(0, false, 10000);
    buyBusiness(1);
    addIncome(0, false, 10000);
    buyBusiness(1);
    expect(playerPortfolio[1].branchCount).toBe(2);
  });
});

describe('upgradeBusiness', () => {
  it('should upgrade a business when wallet is sufficient', () => {
    addIncome(0, false, 10000);
    buyBusiness(0);
    addIncome(0, false, 10000);
    upgradeBusiness(0);
    expect(playerPortfolio[0].isUpgraded).toBe(true);
  });
  it('should not upgrade a business when wallet is insufficient', () => {
    upgradeBusiness(0);
    expect(playerPortfolio[0].isUpgraded).toBe(false);
  });
  it('should not upgrade a business that has already been upgraded', () => {
    addIncome(0, false, 10000);
    buyBusiness(0);
    addIncome(0, false, 10000);
    upgradeBusiness(0);
    const walletAfterFirstUpgrade = playerWallet;
    upgradeBusiness(0);
    expect(playerWallet).toBe(walletAfterFirstUpgrade);
  });
});

describe('hireManager', () => {
  it('should hire a manager when wallet is sufficient', () => {
    addIncome(0, false, 10000);
    buyBusiness(0);
    addIncome(0, false, 10000);
    hireManager(0);
    expect(playerPortfolio[0].hasManager).toBe(true);
  });
  it('should not hire a manager when wallet is insufficient', () => {
    hireManager(0);
    expect(playerPortfolio[0].hasManager).toBe(false);
  });
});

describe('calculateManagerIncome', () => {
  it('should add income based on time elapsed since manager hire', () => {
    addIncome(0, false, 10000);
    hireManager(0);
    const hireTime = playerPortfolio[0].managerHireTime;
    const simulatedTime = hireTime + playerPortfolio[0].payoutDelay * 3;
    const walletAfterHire = playerWallet;
    calculateManagerIncome(0, simulatedTime);
    expect(playerWallet).toBeGreaterThan(walletAfterHire);
  });
});
