import React from 'react';

import { TextColor } from '../../@types/studyBootStrap';

type SimpleTextProps = {
  title?: string;
  name: string;
  value: string | number | string[];
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  textColorClass?: TextColor;
};

/**
 *
 * @returns テキストのみ
 */
const SimpleText: React.FC<SimpleTextProps> = ({
  title = null,
  name,
  value,
  hidden = false,
  onClick,
  textColorClass = null,
}) => {
  return (
    <div onClick={onClick}>
      {title && <label>{title}</label>}
      <div hidden={hidden} id={name} className={textColorClass}>
        {value}
      </div>
    </div>
  );
};

export default SimpleText;
