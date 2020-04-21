import React from 'react';
import { Plant } from '../data/Plant';
import { Avatar, useTheme, Theme } from '@material-ui/core';
import * as colors from '@material-ui/core/colors';

export type PlantAvatarProps = {
  plant: Plant;
};

const availableColors = [
  colors.amber,
  colors.blue,
  colors.blueGrey,
  colors.brown,
  colors.cyan,
  colors.deepOrange,
  colors.deepPurple,
  colors.green,
  colors.indigo,
  colors.lightBlue,
  colors.lightGreen,
  colors.lime,
  colors.orange,
  colors.pink,
  colors.purple,
  colors.red,
  colors.teal,
  colors.yellow,
];

function getAvatarStyle(theme: Theme, name: string): {} | { color: string; backgroundColor: string } {
  if (name.length === 0) return {};

  const firstLetterCodePoint = name.codePointAt(0);
  if (firstLetterCodePoint === undefined) return {};

  const themeColor = availableColors[firstLetterCodePoint % availableColors.length];

  return {
    color: theme.palette.getContrastText(themeColor[500]),
    backgroundColor: themeColor[500],
  };
}

const PlantAvatar: React.SFC<PlantAvatarProps> = ({ plant }) => {
  const initials = plant.name.slice(0, 1).toLocaleUpperCase();
  const theme = useTheme();

  return <Avatar style={getAvatarStyle(theme, plant.name)}>{initials}</Avatar>;
};

export default PlantAvatar;
