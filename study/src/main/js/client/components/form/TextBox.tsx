import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';
import { isEmpty } from '../../../study/util/studyUtil';

type TextBoxProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string | number | string[];
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** テキストボックスを非表示にするかどうか */
  hidden?: boolean;
  /** バリデーションを行うかどうかを示すフラグ */
  validate?: boolean;
  /** バリデーションが実行されたかどうかを示すフラグ */
  touched?: unknown;
  /** エラーメッセージ */
  error?: unknown;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
  /** 読み取り専用にするか */
  readonly?: boolean;
};

/**
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
  readonly = false,
}) => {
  const type = hidden ? 'hidden' : 'text';

  return (
    <FormControl
      title={title}
      name={name}
      // 0はそのまま表示したいため
      value={isEmpty(value) ? '' : value}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
      readonly={readonly}
    >
      <Form.Control type={type} />
    </FormControl>
  );
};

export default TextBox;
