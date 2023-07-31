/* eslint-disable */

import { SVGAttributes, FunctionComponent } from 'react';
export { default as IconFontIconAlipay } from './IconFontIconAlipay';
export { default as IconFontIconUser } from './IconFontIconUser';
export { default as IconFontIconSetup } from './IconFontIconSetup';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: 'alipay' | 'user' | 'setup';
  size?: number;
  color?: string | string[];
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
