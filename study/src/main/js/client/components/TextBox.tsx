import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';

type TextBoxProps = {
  title?: string;
  name: string;
  value: string | number | string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  hidden?: boolean;
  validate?: boolean;
  touched?: unknown;
  error?: unknown;
  dirty?: boolean;
  isOnClickEditable?: boolean;
};

/**
 * @param title - テキストボックスのタイトル
 * @param name - テキストボックスの名前
 * @param value - テキストボックスの値
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param onBlur - テキストボックスからフォーカスが外れた時のハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @param dirty - formが変更されたかどうか
 * @param isOnClickEditable - 通常は文字のみでクリックしたときに入力できるようにする
 * @returns form内のテキストボックス
 */
const TextBox: React.FC<TextBoxProps> = ({
  title = null,
  name,
  value,
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
}) => {
  const type = hidden ? 'hidden' : 'text';

  return (
    <FormControl
      title={title}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
    >
      <Form.Control type={type} />
    </FormControl>
  );
};

export default TextBox;
