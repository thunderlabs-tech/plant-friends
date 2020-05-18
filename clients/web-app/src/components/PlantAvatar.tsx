import React from 'react';
import { Plant } from '../data/Plant';
import '@rmwc/avatar/styles';
import { Avatar } from '@rmwc/avatar';
import { ColorPalette, cyan, green, lightGreen, lime, grey } from '../utilities/ColorPalettes';
import getValue from '../utilities/lang/getValue';
import getContrastTextColor from '../utilities/getContrastTextColor';

import css from './PlantAvatar.module.css';

export type PlantAvatarProps = {
  plant: Plant;
};

function notObsceneShades(color: ColorPalette): string[] {
  const shades = [100, 200, 300, 400, 500] as const;
  return shades.map((value) => getValue(color, value));
}

const availableColors = [
  ...notObsceneShades(cyan),
  ...notObsceneShades(green),
  ...notObsceneShades(lightGreen),
  ...notObsceneShades(lime),
];

const PlantAvatar: React.FC<PlantAvatarProps> = (props) => {
  const plant = props.plant;
  const colorIndex = parseInt(plant.id, 10) || 0;

  const backgroundColor = availableColors[colorIndex % availableColors.length];
  const textColor = getContrastTextColor(backgroundColor, grey[800], grey[200]);

  return (
    <Avatar
      className={css.PlantAvatar}
      name={plant.name.toLocaleUpperCase()}
      size="large"
      style={{
        backgroundColor,
        color: textColor,
      }}
    />
  );
};

export default PlantAvatar;
