import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

type TextBoxExclusionFormProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** スタイル */
  style?: React.CSSProperties;
  /** テキストボックスがクリックされたときのハンドラ関数 */
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  /** 非表示にするかどうか */
  hidden?: boolean;
};

/**
 * formの送信対象から除外するときに使用する想定
 * @returns form内のテキストボックス
 */
const TextBoxExclusionForm: React.FC<TextBoxExclusionFormProps> = ({
  title = null,
  onChange,
  onClick,
  style,
  hidden = false,
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
