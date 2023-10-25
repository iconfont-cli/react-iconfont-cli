/* eslint-disable */

import { SVGAttributes, FunctionComponent } from 'react';
export { default as IconAlipay } from './IconAlipay';
export { default as IconUser } from './IconUser';
export { default as IconSetup } from './IconSetup';

export interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: 'alipay' | 'user' | 'setup';
  size?: number;
  color?: string | string[];
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
