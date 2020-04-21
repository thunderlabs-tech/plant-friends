import React from 'react';
import { Plant } from '../data/Plant';
import { Avatar, useTheme, Theme, Color } from '@material-ui/core';
import * as colors from '@material-ui/core/colors';
import getValue from '../utilities/lang/getValue';

export type PlantAvatarProps = {
  plant: Plant;
};

function notObsceneShades(color: Color): string[] {
  const shades = [100, 200, 300, 400, 500] as const;
  return shades.map((value) => getValue(color, value));
}

const availableColors = [
  ...notObsceneShades(colors.cyan),
  ...notObsceneShades(colors.green),
  ...notObsceneShades(colors.lightGreen),
  ...notObsceneShades(colors.lime),
];

function getAvatarStyle(theme: Theme, plant: Plant): {} | { color: string; backgroundColor: string } {
  const colorIndex = parseInt(plant.id) || plant.id.codePointAt(0);
  if (colorIndex === undefined) return {};

  const themeColor = availableColors[colorIndex % availableColors.length];

  return {
    color: theme.palette.getContrastText(themeColor),
    backgroundColor: themeColor,
  };
}

const PlantAvatar: React.SFC<PlantAvatarProps> = ({ plant }) => {
  const initials = plant.name.slice(0, 1).toLocaleUpperCase();
  const theme = useTheme();

  return <Avatar style={getAvatarStyle(theme, plant)}>{initials}</Avatar>;
};

export default PlantAvatar;
