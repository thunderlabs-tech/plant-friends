import { ThemeProviderProps } from '@rmwc/theme';

const primaryColor = '#10c586';
const secondaryColor = '#c5104f';

const theme: ThemeProviderProps['options'] = {
  background: '#fafafa',
  primary: primaryColor,
  primaryBg: primaryColor,
  secondary: secondaryColor,
  secondaryBg: secondaryColor,
  onSecondary: 'white',
  onPrimary: 'white',
};

export default theme;
