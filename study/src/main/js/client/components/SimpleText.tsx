import React from 'react';

/**
 * boot strap用テキスト指定タイプ
 */
type TextColorClass =
  | 'text-primary'
  | 'text-secondary'
  | 'text-success'
  | 'text-danger'
  | 'text-warning'
  | 'text-info'
  | 'text-light'
  | 'text-dark'
  | 'text-body'
  | 'text-muted'
  | 'text-white'
  | 'text-black'
  | `text-black-${number}`
  | `text-white-${number}`;

type SimpleTextProps = {
  title?: string;
  name: string;
  value: string | number | string[];
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  textColorClass?: TextColorClass;
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
