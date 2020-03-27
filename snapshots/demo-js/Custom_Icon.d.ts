/* eslint-disable */

import { CSSProperties, DOMAttributes, FunctionComponent } from 'react';

interface Props extends DOMAttributes<SVGElement> {
  name: 'alipay' | 'user' | 'setup';
  size?: number;
  color?: string | string[];
  style?: CSSProperties;
  className?: string;
}

export declare const Custom_Icon: FunctionComponent<Props>;

export default Custom_Icon;
