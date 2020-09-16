import React from "react";
import { Plant } from "src/data/Plant";
import "@rmwc/avatar/styles";
import { Avatar } from "@rmwc/avatar";
import { grey } from "src/utilities/ColorPalettes";
import getContrastTextColor from "src/utilities/getContrastTextColor";

import css from "src/components/PlantAvatar.module.css";

export type PlantAvatarProps = {
  plant: Plant;
};

const availableColors: [string, ...string[]] = ["#cef0de"];

const PlantAvatar: React.FC<PlantAvatarProps> = (props) => {
  const plant = props.plant;
  const colorIndex = plant.createdAt.valueOf();

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
