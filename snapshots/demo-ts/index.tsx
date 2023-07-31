/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import IconFontIconAlipay from './IconFontIconAlipay';
import IconFontIconUser from './IconFontIconUser';
import IconFontIconSetup from './IconFontIconSetup';
export { default as IconFontIconAlipay } from './IconFontIconAlipay';
export { default as IconFontIconUser } from './IconFontIconUser';
export { default as IconFontIconSetup } from './IconFontIconSetup';

export type IconNames = 'alipay' | 'user' | 'setup';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'alipay':
      return <IconFontIconAlipay {...rest} />;
    case 'user':
      return <IconFontIconUser {...rest} />;
    case 'setup':
      return <IconFontIconSetup {...rest} />;

  }

  return null;
};

export default IconFont;
