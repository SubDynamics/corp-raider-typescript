import { Application, Assets, Container, Sprite, Text, Ticker } from 'pixi.js';
import {
  ASSET_LIST,
  BUSINESS_DISPLAY_COUNT,
  GAME_COLORS,
  MIDDLE_VAL,
  businessesForSale,
} from './const';
import createMenuButton from './menuButton';
import createBusinessWidget from './businessWidget';
import type { BusinessWidgetContainer } from './businessWidget';
import { getFitScale, moneyFormatter } from './util';
import {
  addIncome,
  buyBusiness,
  hireManager,
  newGame,
  playerPortfolio,
  playerWallet,
  restoreGameFromStorage,
  upgradeBusiness,
} from './gameLogic';

const widgetList: BusinessWidgetContainer[] = [];

let upgradeOverlayIsShown = false;
let managerOverlayIsShown = false;

const refreshWidgets = (): void => {
  widgetList.forEach((widget, index) => {
    widget.refreshState(playerWallet, playerPortfolio[index]);
  });
};

const showOverlays = (overlayType: 'upgrade' | 'manager'): void => {
  widgetList.forEach((widget, index) => {
    widget.showOverlay(playerWallet, overlayType, playerPortfolio[index]);
  });
};

const hideOverlays = (): void => {
  upgradeOverlayIsShown = false;
  managerOverlayIsShown = false;
  widgetList.forEach((widget, index) => {
    widget.hideOverlay();
    widget.refreshState(playerWallet, playerPortfolio[index]);
  });
};

newGame();
restoreGameFromStorage();

const sharedTicker = Ticker.shared;
sharedTicker.autoStart = false;
sharedTicker.stop();

const init = async (): Promise<void> => {
  const app = new Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio,
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  ASSET_LIST.forEach((asset) => {
    Assets.add({ alias: asset.name, src: asset.path });
  });
  await Assets.load(ASSET_LIST.map((a) => a.name));

  const gameContainer = new Container();
  gameContainer.x = app.screen.width * MIDDLE_VAL;
  gameContainer.y = app.screen.height * MIDDLE_VAL;
  app.stage.addChild(gameContainer);

  const backgroundSprite = Sprite.from('gameBackground');
  backgroundSprite.anchor.set(MIDDLE_VAL);
  gameContainer.addChild(backgroundSprite);

  const designWidth = backgroundSprite.width;
  const designHeight = backgroundSprite.height;
  const fitGameContainer = (): void => {
    gameContainer.scale.set(
      getFitScale(app.screen.width, app.screen.height, designWidth, designHeight),
    );
    gameContainer.x = app.screen.width * MIDDLE_VAL;
    gameContainer.y = app.screen.height * MIDDLE_VAL;
  };
  fitGameContainer();
  app.renderer.on('resize', fitGameContainer);

  const walletText = new Text({
    text: moneyFormatter(playerWallet),
    style: {
      fontFamily: 'Offside',
      fontSize: 50,
      fill: GAME_COLORS.textGreen,
      align: 'center',
    },
  });

  const upgradeClickHandler = (): void => {
    if (upgradeOverlayIsShown) {
      hideOverlays();
    } else {
      upgradeOverlayIsShown = true;
      managerOverlayIsShown = false;
      showOverlays('upgrade');
    }
  };

  const managersClickHandler = (): void => {
    if (managerOverlayIsShown) {
      hideOverlays();
    } else {
      upgradeOverlayIsShown = false;
      managerOverlayIsShown = true;
      showOverlays('manager');
    }
  };

  const buyHandler = (businessIndex: number): void => {
    buyBusiness(businessIndex);
    walletText.text = moneyFormatter(playerWallet);
    refreshWidgets();
  };

  const earnHandler = (businessIndex: number, isClickIncome: boolean): void => {
    addIncome(businessIndex, isClickIncome);
    walletText.text = moneyFormatter(playerWallet);
    refreshWidgets();
  };

  const upgradeBusinessHandler = (businessIndex: number): void => {
    upgradeBusiness(businessIndex);
    hideOverlays();
    walletText.text = moneyFormatter(playerWallet);
    refreshWidgets();
  };

  const manageBusinessHandler = (businessIndex: number): void => {
    hireManager(businessIndex);
    hideOverlays();
    walletText.text = moneyFormatter(playerWallet);
    refreshWidgets();
  };

  const walletSprite = Sprite.from('wallet');
  walletSprite.addChild(walletText);
  walletText.anchor.set(MIDDLE_VAL, MIDDLE_VAL);
  walletSprite.anchor.set(MIDDLE_VAL, MIDDLE_VAL);

  gameContainer.addChild(walletSprite);
  walletSprite.x = 110;
  walletSprite.y = -270;

  const upgradeButton = createMenuButton({
    textureName: 'menuButton',
    label: 'Upgrades',
    x: -468,
    y: -40,
    onClick: upgradeClickHandler,
  });
  const managersButton = createMenuButton({
    textureName: 'menuButton',
    label: 'Managers',
    x: -468,
    y: 10,
    onClick: managersClickHandler,
  });

  gameContainer.addChild(upgradeButton);
  gameContainer.addChild(managersButton);

  const firstWidgetX = -260;
  const firstWidgetY = -228;

  for (let i = 0; i < BUSINESS_DISPLAY_COUNT; i++) {
    const widget = createBusinessWidget(
      i,
      businessesForSale[i],
      playerPortfolio[i],
      buyHandler,
      earnHandler,
      upgradeBusinessHandler,
      manageBusinessHandler
    );

    const yMultiplier = i < 5 ? i : i - 5;
    const xPosition = i < 5 ? firstWidgetX : firstWidgetX + widget.width + 10;
    const yPosition = firstWidgetY + yMultiplier * (widget.height + 10);
    gameContainer.addChild(widget);
    widget.x = xPosition;
    widget.y = yPosition;

    widgetList.push(widget);
  }
};

init();
