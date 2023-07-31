/* eslint-disable */

import React from 'react';
import IconFontIconAlipay from './IconFontIconAlipay';
import IconFontIconUser from './IconFontIconUser';
import IconFontIconSetup from './IconFontIconSetup';
export { default as IconFontIconAlipay } from './IconFontIconAlipay';
export { default as IconFontIconUser } from './IconFontIconUser';
export { default as IconFontIconSetup } from './IconFontIconSetup';

const IconFont = ({ name, ...rest }) => {
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
