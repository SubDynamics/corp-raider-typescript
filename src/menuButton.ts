import { Container, Sprite, Text } from 'pixi.js';

interface MenuButtonOptions {
  textureName: string;
  label: string;
  x: number;
  y: number;
  onClick: () => void;
}

const createMenuButton = ({
  textureName,
  label,
  x,
  y,
  onClick,
}: MenuButtonOptions): Container => {
  const button = new Container();
  button.x = x;
  button.y = y;
  button.interactive = true;
  button.cursor = 'pointer';

  const sprite = Sprite.from(textureName);
  sprite.anchor.set(0.5);
  button.addChild(sprite);

  const text = new Text({
    text: label,
    style: {
      fontFamily: 'Offside',
      fontSize: 18,
      fill: 0xffffff,
      align: 'center',
    },
  });
  text.anchor.set(0.5);
  button.addChild(text);

  button.on('pointerdown', onClick);

  return button;
};

export default createMenuButton;
