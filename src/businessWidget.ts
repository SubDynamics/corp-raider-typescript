import { Container, Text, Sprite } from 'pixi.js';
import type { PortfolioItem, BusinessForSale } from './const';
import { MIDDLE_VAL, GAME_COLORS } from './const';
import { countdownFormatter, moneyFormatter, calculatePayout } from './util';
import createBuyButton, { BuyButtonContainer } from './buyButton';
import createEarnButton, { EarnButtonContainer } from './earnButton';

export type OverlayType = 'upgrade' | 'manager';

export interface BusinessWidgetContainer extends Container {
  isOwned: boolean;
  hasManager: boolean;
  showOverlay: (
    walletAmount: number,
    overlayType: OverlayType,
    portfolioItem?: PortfolioItem
  ) => void;
  hideOverlay: () => void;
  refreshState: (walletAmount: number, portfolioItem?: PortfolioItem) => void;
}

const disabledGray = 0x777777;

const createBusinessWidget = (
  businessIndex: number,
  businessInfoObject: BusinessForSale,
  portfolioObject: PortfolioItem | undefined,
  buyHandler: (index: number) => void,
  earnHandler: (index: number, isClickIncome: boolean) => void,
  upgradeHandler: (index: number) => void,
  manageHandler: (index: number) => void
): BusinessWidgetContainer => {
  const widget = new Container() as BusinessWidgetContainer;
  widget.isOwned = !!portfolioObject;
  widget.hasManager = !!(portfolioObject && portfolioObject.hasManager);

  const widgetBackground = Sprite.from('businessSpriteBG');
  widget.addChild(widgetBackground);

  const timerText = new Text({
    text: countdownFormatter(0),
    style: {
      fontFamily: 'Offside',
      fontSize: 28,
      align: 'center',
      fill: widget.isOwned ? GAME_COLORS.textOrange : disabledGray,
    },
  });

  const earnClickTimerStart = (
    enableButtonCallback?: (isActivated: boolean) => void
  ): void => {
    let payoutTime = Date.now() + businessInfoObject.payoutDelay;
    timerText.text = countdownFormatter(payoutTime - Date.now() - 100);

    const timerInterval = setInterval(() => {
      const timeDelta = payoutTime - Date.now();
      timerText.text = countdownFormatter(timeDelta);

      if (timeDelta < 1000) {
        earnHandler(businessIndex, !widget.hasManager);
        if (widget.hasManager) {
          payoutTime = Date.now() + businessInfoObject.payoutDelay;
        } else {
          clearInterval(timerInterval);
          enableButtonCallback?.(true);
          earnButton.activate(true);
        }
      }
    }, 250);
  };

  const getCurrentPayout = (): number => {
    if (portfolioObject) {
      return calculatePayout(portfolioObject);
    }
    return businessInfoObject.payout;
  };

  const buyButton: BuyButtonContainer = createBuyButton(
    businessInfoObject.cost,
    businessIndex,
    buyHandler
  );
  const earnButton: EarnButtonContainer = createEarnButton(
    getCurrentPayout(),
    businessIndex,
    earnClickTimerStart,
    widget.isOwned
  );

  earnButton.activate(widget.isOwned && !widget.hasManager);
  if (widget.hasManager) earnClickTimerStart();

  const timerBackground = Sprite.from('timer');

  const titleText = new Text({
    text: businessInfoObject.name,
    style: {
      fontFamily: 'Offside',
      fontSize: 20,
      align: 'center',
    },
  });

  timerText.anchor.set(MIDDLE_VAL);
  titleText.anchor.set(MIDDLE_VAL);

  widget.addChild(buyButton);
  widget.addChild(earnButton);
  widget.addChild(timerBackground);
  widget.addChild(timerText);
  widget.addChild(titleText);

  titleText.x = widgetBackground.width * MIDDLE_VAL;
  titleText.y = 14;
  buyButton.x = 20;
  earnButton.x = buyButton.x + buyButton.width + 10;
  timerBackground.x = earnButton.x + 84;
  earnButton.y = buyButton.y = timerBackground.y = 30;
  timerText.x = timerBackground.width * MIDDLE_VAL + timerBackground.x;
  timerText.y = timerBackground.y + 30;

  // MANAGER / UPGRADE OVERLAY MODES
  const managerOverlayButton = new Container();
  const upgradeOverlayButton = new Container();
  const managerBG = Sprite.from('widgetManagerBtn');
  const upgradeBG = Sprite.from('widgetUpgradeBtn');
  const managerInactiveBG = Sprite.from('businessSpriteBG');
  const upgradeInactiveBG = Sprite.from('businessSpriteBG');

  const managerTitleText = new Text({
    text: 'Hire Manager:\n' + businessInfoObject.name,
    style: {
      fontFamily: 'Offside',
      fontSize: 18,
      align: 'left',
    },
  });
  const upgradeTitleText = new Text({
    text: 'Upgrade:\n' + businessInfoObject.name,
    style: {
      fontFamily: 'Offside',
      fontSize: 18,
      align: 'left',
    },
  });

  managerTitleText.anchor.set(0, MIDDLE_VAL);
  upgradeTitleText.anchor.set(0, MIDDLE_VAL);

  managerTitleText.x = upgradeTitleText.x = 120;
  managerTitleText.y = upgradeTitleText.y =
    widgetBackground.height * MIDDLE_VAL;

  const upgradePriceText = new Text({
    text: moneyFormatter(businessInfoObject.upgradeCost, true),
    style: {
      fontFamily: 'Offside',
      fontSize: 22,
      align: 'center',
    },
  });
  const managerPriceText = new Text({
    text: moneyFormatter(businessInfoObject.managerCost, true),
    style: {
      fontFamily: 'Offside',
      fontSize: 22,
      align: 'center',
    },
  });

  managerPriceText.anchor.set(MIDDLE_VAL);
  upgradePriceText.anchor.set(MIDDLE_VAL);
  managerPriceText.x = upgradePriceText.x = 58;
  managerPriceText.y = upgradePriceText.y =
    widgetBackground.height * MIDDLE_VAL;

  managerOverlayButton.addChild(managerInactiveBG);
  managerOverlayButton.addChild(managerBG);
  managerOverlayButton.addChild(managerTitleText);
  managerOverlayButton.addChild(managerPriceText);
  managerOverlayButton.on('pointerdown', () => manageHandler(businessIndex));
  managerOverlayButton.interactive = false;
  managerOverlayButton.cursor = 'default';

  upgradeOverlayButton.addChild(upgradeInactiveBG);
  upgradeOverlayButton.addChild(upgradeBG);
  upgradeOverlayButton.addChild(upgradeTitleText);
  upgradeOverlayButton.addChild(upgradePriceText);
  upgradeOverlayButton.on('pointerdown', () => upgradeHandler(businessIndex));
  upgradeOverlayButton.interactive = false;
  upgradeOverlayButton.cursor = 'default';

  widget.addChild(managerOverlayButton);
  managerOverlayButton.visible = false;

  widget.addChild(upgradeOverlayButton);
  upgradeOverlayButton.visible = false;

  widget.showOverlay = (
    walletAmount: number,
    overlayType: OverlayType,
    portfolioItem?: PortfolioItem
  ): void => {
    earnButton.visible = false;
    buyButton.visible = false;
    if (overlayType === 'upgrade') {
      if (portfolioItem && portfolioItem.isUpgraded) {
        upgradeTitleText.text = 'Upgraded!';
        upgradeTitleText.style.fill = 0xeeeeee;
        upgradeInactiveBG.tint = 0x555555;
        upgradeInactiveBG.visible = true;
        upgradeBG.visible = false;
        upgradePriceText.visible = false;
        upgradeOverlayButton.interactive = false;
        upgradeOverlayButton.cursor = 'default';
      } else {
        upgradeTitleText.text =
          'Upgrade 3x Payout:\n' + businessInfoObject.name;
        upgradePriceText.text = moneyFormatter(
          businessInfoObject.upgradeCost,
          true
        );
        upgradePriceText.visible = true;
        upgradeTitleText.style.fill = 0x000000;

        const buttonIsActive =
          widget.isOwned && walletAmount >= businessInfoObject.upgradeCost;
        upgradeBG.visible = buttonIsActive;
        upgradeOverlayButton.interactive = buttonIsActive;
        upgradeOverlayButton.cursor = buttonIsActive ? 'pointer' : 'default';
        upgradeInactiveBG.tint = 0xffffff;
        upgradeInactiveBG.visible = !buttonIsActive;
      }
      managerOverlayButton.visible = false;
      upgradeOverlayButton.visible = true;
    } else if (overlayType === 'manager') {
      if (portfolioItem && portfolioItem.hasManager) {
        managerTitleText.text = 'Managed!';
        managerPriceText.visible = false;
        managerTitleText.style.fill = 0xeeeeee;
        managerBG.visible = false;
        upgradeBG.visible = false;
        managerInactiveBG.tint = 0x555555;
        managerInactiveBG.visible = true;
        managerOverlayButton.interactive = false;
        managerOverlayButton.cursor = 'default';
      } else {
        managerTitleText.text = 'Hire Manager:\n' + businessInfoObject.name;
        managerTitleText.style.fill = 0x000000;
        managerPriceText.text = moneyFormatter(
          businessInfoObject.managerCost,
          true
        );
        managerPriceText.visible = true;
        const buttonIsActive =
          widget.isOwned && walletAmount >= businessInfoObject.managerCost;
        managerBG.visible = buttonIsActive;
        managerOverlayButton.interactive = buttonIsActive;
        managerOverlayButton.cursor = buttonIsActive ? 'pointer' : 'default';
        managerInactiveBG.tint = 0xffffff;
        managerInactiveBG.visible = !buttonIsActive;
      }
      managerOverlayButton.visible = true;
      upgradeOverlayButton.visible = false;
    }
  };

  widget.hideOverlay = (): void => {
    earnButton.visible = true;
    buyButton.visible = true;
    managerOverlayButton.visible = false;
    upgradeOverlayButton.visible = false;
  };

  widget.refreshState = (
    walletAmount: number,
    portfolioItem?: PortfolioItem
  ): void => {
    buyButton.activate(walletAmount >= businessInfoObject.cost);
    if (portfolioItem) {
      earnButton.refreshEarnAmount(calculatePayout(portfolioItem));
      widget.hasManager = portfolioItem.hasManager;

      if (portfolioItem.branchCount > 1) {
        titleText.text = portfolioItem.name + ' x ' + portfolioItem.branchCount;
      }
    }
    if (portfolioItem && !widget.isOwned) {
      widget.isOwned = true;
      timerText.style.fill = GAME_COLORS.textOrange;
      earnButton.activate(true);
    }
  };

  return widget;
};

export default createBusinessWidget;
