import cn from 'classnames';
import React, { useCallback, useMemo } from 'react';

import { TextColor } from '../../../../@types/studyBootstrap';

import '../../../../../css/view/text/text.css';

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
  textMaxLength = 30,
}) => {
  const str = String(value);
  const isTruncated = useMemo(
    () => textMaxLength && value && str.length > textMaxLength,
    [textMaxLength, value, str.length]
  );
  const text = useMemo(
    () => (isTruncated ? str.substring(0, textMaxLength) + '…' : value),
    [isTruncated, str, textMaxLength, value]
  );
  const divClass = useMemo(
    () => cn('text-fit', 'text-wrap', textColorClass),
    [textColorClass]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onClick?.(event);
    },
    [onClick]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onMouseDown?.(event);
    },
    [onMouseDown]
  );

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      title={isTruncated ? str : undefined}
      aria-label={str}
    >
      {title && <label>{title}</label>}
      <div hidden={hidden} id={name} className={divClass}>
        {text}
      </div>
    </div>
  );
};

export default SimpleText;
