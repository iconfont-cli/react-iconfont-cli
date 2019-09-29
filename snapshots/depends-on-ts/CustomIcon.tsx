/* tslint:disable */
/* eslint-disable */

import React, { CSSProperties, DOMAttributes, FunctionComponent } from 'react';
import IconAlipay from './IconAlipay';
import IconUser from './IconUser';
import IconSetup from './IconSetup';

export type IconNames = 'alipay' | 'user' | 'setup';

interface Props extends DOMAttributes<SVGElement> {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: CSSProperties;
  className?: string;
}

const CustomIcon: FunctionComponent<Props> = ({ color, name, size, ...rest }) => {
  switch (name) {
    case 'alipay':
      return <IconAlipay size={size} color={color} {...rest} />;
    case 'user':
      return <IconUser size={size} color={color} {...rest} />;
    case 'setup':
      return <IconSetup size={size} color={color} {...rest} />;

  }

  return null;
};

CustomIcon.defaultProps = {
  size: 20,
};

export default CustomIcon;
