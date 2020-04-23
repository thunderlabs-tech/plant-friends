import { createMuiTheme } from '@material-ui/core/styles';

export const DEFAULT_SPACING = 16;
export const yellow1 = '#ffa25c';

const plantFriendsBlue = {
  light: '#5eb4ff',
  extraLight: '#75bcfa',
  main: '#4287f5',
  dark: '#00806a',
  contrastText: '#ffffff',
};

export { plantFriendsBlue };

export const monospaced = Object.freeze({
  fontFamily: '"Roboto Mono", monospace',
});

const theme = createMuiTheme({
  palette: {
    primary: plantFriendsBlue,
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: plantFriendsBlue.main,
      },
    },
  },
});

export default theme;
