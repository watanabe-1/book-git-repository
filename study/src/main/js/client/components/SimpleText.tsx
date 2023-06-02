import React from 'react';

/**
 *
 * @returns テキストのみ
 */
const SimpleText = ({
  title = null,
  name,
  value,
  hidden = false,
}: {
  title?: string;
  name: string;
  value: string | number | string[];
  hidden?: boolean;
}) => {
  return (
    <div>
      {title && <label>{title}</label>}
      <div hidden={hidden} id={name}>
        {value}
      </div>
    </div>
  );
};

export default SimpleText;
