import React, { useCallback, useState } from 'react';
import Form from 'react-bootstrap/Form';

type TextBoxExclusionFormProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** 入力値 */
  value?: string;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** フォーカスがついた時のイベント */
  onFocus?: (event?: React.FocusEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** スタイル */
  style?: React.CSSProperties;
  /** テキストボックスがクリックされたときのハンドラ関数 */
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  /** key入力イベント */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 非表示にするかどうか */
  hidden?: boolean;
};

/**
 * formの送信対象から除外するときに使用する想定
 * @returns form内のテキストボックス
 */
const TextBoxExclusionForm: React.FC<TextBoxExclusionFormProps> = ({
  title = null,
  value = null,
  onChange,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  style,
  hidden = false,
}) => {
  const [inputValue, setinputValue] = useState(value);
  const type = hidden ? 'hidden' : 'text';

  /**
   * inputに値をセット
   * @param e event
   */
  const handleChange = useCallback(
    async (e) => {
      onChange?.(e);
      setinputValue(e.target.value);
    },
    [onChange, setinputValue]
  );

  return (
    <Form.Group>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control
        type={type}
        value={value || inputValue}
        onChange={handleChange}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        style={style}
      />
    </Form.Group>
  );
};

export default TextBoxExclusionForm;
