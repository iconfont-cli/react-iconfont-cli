/* eslint-disable */

import React from 'react';
import IconAlipay from './IconAlipay';
import IconUser from './IconUser';
import IconSetup from './IconSetup';

const IconFont = ({ color, name, size, ...rest }) => {
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

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
