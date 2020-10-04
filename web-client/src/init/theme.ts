import { Color } from "src/utilities/Color";
import { NonEmptyArray } from "src/utilities/lang/NonEmptyArray";

const backgroundColor = "#f2f8f8";
const primaryColor = "#8ECAD2";
const secondaryColor = "#73B6A9";

const primaryTextColorOnLight = "#555a70";
const secondaryTextColorOnLight = "#7c7f87";
export const inputBg = "#deecec";

export const plantAvatarColors: NonEmptyArray<Color> = ["#cef0de"];

const theme = {
  background: backgroundColor,
  surface: "white",
  primary: primaryColor,
  primaryBg: primaryColor,
  secondary: secondaryColor,
  secondaryBg: secondaryColor,

  onPrimary: "white",
  onSecondary: "white",

  textSecondaryOnBackground: secondaryTextColorOnLight,
  textPrimaryOnLight: primaryTextColorOnLight,
  textSecondaryOnLight: secondaryTextColorOnLight,

  onSurface: primaryTextColorOnLight,
  onLight: primaryTextColorOnLight,
};

export default theme;
