import { Container, Text, Sprite } from 'pixi.js';
import { MIDDLE_VAL } from './const';
import { moneyFormatter } from './util';

export interface BuyButtonContainer extends Container {
  activate: (isActivated: boolean) => void;
}

const createBuyButton = (
  costAmount: number,
  businessIndex: number,
  clickHandler: (index: number) => void
): BuyButtonContainer => {
  const button = new Container() as BuyButtonContainer;
  const buttonShapeDisabled = Sprite.from('buyButtonDisabled');
  const buttonShape = Sprite.from('buyButtonEnabled');

  const buttonTextContent = 'BUY:\n' + moneyFormatter(costAmount, true);
  const buttonText = new Text({
    text: buttonTextContent,
    style: {
      fontFamily: 'Offside',
      fontSize: 14,
      align: 'center',
    },
  });

  buttonText.anchor.set(MIDDLE_VAL, MIDDLE_VAL);
  buttonText.x = buttonShape.width * MIDDLE_VAL;
  buttonText.y = buttonShape.height * MIDDLE_VAL;

  button.addChild(buttonShapeDisabled);
  button.addChild(buttonShape);
  button.addChild(buttonText);

  button.interactive = false;
  button.cursor = 'default';
  buttonShape.visible = false;

  button.activate = (isActivated: boolean): void => {
    button.interactive = isActivated;
    button.cursor = isActivated ? 'pointer' : 'default';
    buttonShape.visible = isActivated;
  };

  button.on('pointerdown', () => {
    clickHandler(businessIndex);
  });

  return button;
};

export default createBuyButton;
