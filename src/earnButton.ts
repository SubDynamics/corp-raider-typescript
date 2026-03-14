import { Container, Text, Sprite } from 'pixi.js';
import { MIDDLE_VAL } from './const';
import { moneyFormatter } from './util';

export interface EarnButtonContainer extends Container {
  earnAmount: number;
  enabled: boolean;
  activate: (isActivated: boolean) => void;
  refreshEarnAmount: (newEarnAmount: number) => void;
}

const createEarnButton = (
  earnAmount: number,
  businessIndex: number,
  timerStartHandler: (
    enableButtonCallback?: (isActivated: boolean) => void
  ) => void,
  isOwned: boolean
): EarnButtonContainer => {
  const button = new Container() as EarnButtonContainer;
  const buttonShapeDisabled = Sprite.from('earnButtonDisabled');
  const buttonShape = Sprite.from('earnButtonEnabled');
  button.earnAmount = earnAmount;
  button.enabled = true;

  const buttonTextContent = 'EARN:\n' + moneyFormatter(earnAmount, true);
  const buttonText = new Text({
    text: buttonTextContent,
    style: {
      fontFamily: 'Offside',
      fontSize: 14,
      align: 'center',
    },
  });

  buttonText.anchor.set(MIDDLE_VAL, MIDDLE_VAL);
  buttonText.x = 42;
  buttonText.y = buttonShape.height * MIDDLE_VAL;

  button.addChild(buttonShapeDisabled);
  button.addChild(buttonShape);
  button.addChild(buttonText);

  button.interactive = isOwned;
  button.cursor = isOwned ? 'pointer' : 'default';
  buttonShape.visible = isOwned;

  button.refreshEarnAmount = (newEarnAmount: number): void => {
    button.earnAmount = newEarnAmount;
    buttonText.text = 'EARN:\n' + moneyFormatter(newEarnAmount, true);
  };

  button.activate = (isActivated: boolean): void => {
    button.interactive = isActivated;
    button.cursor = isActivated ? 'pointer' : 'default';
    buttonShape.visible = isActivated;
  };

  button.on('pointerdown', () => {
    timerStartHandler(button.activate);
    button.activate(false);
  });

  return button;
};

export default createEarnButton;
