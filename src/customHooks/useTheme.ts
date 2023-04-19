import {getClientKey} from '@utilities/strings';
import {standardTheme} from 'state/GlobalState';

const useTheme = () => {
  const theme = standardTheme;

  const clientKey = getClientKey();

  // Add jsDocs for each color

  const light = {
    /**
     * Used for: actions like buttons
     */
    primary: '#667eea',
    /**
     * Used for:heading text like title
     */
    darkest: '#141a33',
    /**
     * Used for: secondary text like subtitle or description
     */
    dark: '#505673',
    /**
     * Used for: non-decorative borders like border for search input
     */
    medium: '#878ca8',
    /**
     * Used for: decorative borders like dividers
     */
    light: '#dadef2',
    /**
     * Used for: alternative backgrounds
     */
    lightest: '#f5f6fa',
    /**
     * Used for: main background
     */
    white: '#ffffff'
  };
  const dark = {
    primary: '#667eea',
    white: '#ffffff',
    lightest: '#c4ccca',
    light: '#9ca6a3',
    medium: '#4d5453',
    dark: '#353b39',
    darkest: '#222625'
  };

  const colors = theme?.colors?.[clientKey] || theme.colors.iconoclast;

  return {...theme, light, dark, colors};
};

export default useTheme;
