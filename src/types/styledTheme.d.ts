import 'styled-components';

import { DefaultTheme } from 'styles';

declare module 'styled-components' {
  export type DefaultTheme = typeof DefaultTheme;
}
