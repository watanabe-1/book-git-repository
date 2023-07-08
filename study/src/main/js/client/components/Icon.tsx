import React from 'react';

type IconProps = {
  /** icon対象 */
  icon: string;
  /** スタイル */
  style?: React.CSSProperties;
  /** 非表示にするかどうか */
  hidden?: boolean;
};

/**
 *
 * @returns アイコン
 */
const Icon: React.FC<IconProps> = ({ icon, style = null, hidden = false }) => {
  return <i className={icon} style={style} hidden={hidden}></i>;
};

export default Icon;
