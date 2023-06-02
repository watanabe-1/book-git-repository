import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

/**
 * formの送信対象から除外するときに使用する想定
 * @returns form内のテキストボックス
 */
const TextBoxExclusionForm = ({
  title = null,
  onChange,
  onClick,
  style,
  hidden = false,
}: {
  title?: string;
  onChange?;
  style?;
  onClick?;

  hidden?: boolean;
}) => {
  const [inputValue, setinputValue] = useState('');
  const type = hidden ? 'hidden' : 'text';

  /**
   * inputに値をセット
   * @param e event
   */
  const handleChange = async (e) => {
    if (onChange) onChange(e);
    setinputValue(e.target.value);
  };

  return (
    <Form.Group>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control
        type={type}
        value={inputValue}
        onChange={handleChange}
        onClick={onClick}
        style={style}
      />
    </Form.Group>
  );
};

export default TextBoxExclusionForm;
