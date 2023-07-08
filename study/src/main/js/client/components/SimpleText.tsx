import React from 'react';

import { TextColor } from '../../@types/studyBootstrap';

type SimpleTextProps = {
  title?: string;
  name: string;
  value: string | number | string[];
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  textColorClass?: TextColor;
  textMaxLength?: number;
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
  onClick = () => null,
  onMouseDown = () => null,
  textColorClass = null,
  textMaxLength = null,
}) => {
  const str = String(value);
  const text =
    textMaxLength && value && str.length > textMaxLength
      ? str.substring(0, textMaxLength) + '…'
      : value;

  return (
    <div onClick={onClick} onMouseDown={onMouseDown}>
      {title && <label>{title}</label>}
      <div hidden={hidden} id={name} className={textColorClass}>
        {text}
      </div>
    </div>
  );
};

export default SimpleText;
