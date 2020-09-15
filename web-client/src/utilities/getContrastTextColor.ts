import { Color } from "src/utilities//Color";

// From https://24ways.org/2010/calculating-color-contrast/
export default function getContrastTextColor(
  hexcolor: Color,
  dark: Color = "black",
  light: Color = "white",
) {
  var r = parseInt(hexcolor.substr(1, 2), 16);
  var g = parseInt(hexcolor.substr(3, 2), 16);
  var b = parseInt(hexcolor.substr(5, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? dark : light;
}
