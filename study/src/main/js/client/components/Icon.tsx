import React from 'react';

/**
 *
 * @returns アイコン
 */
const Icon = ({
  icon,
  style = null,
  hidden = false,
}: {
  icon: string;
  style?: React.CSSProperties;
  hidden?: boolean;
}) => {
  return <i className={icon} style={style} hidden={hidden}></i>;
};

export default Icon;
