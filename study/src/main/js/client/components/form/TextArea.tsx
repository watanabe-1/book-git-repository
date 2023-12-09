import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';
import { simpleTrim } from '../../../study/util/studyStringUtil';

type TextAreaProps = {
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
  touched?: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
  /** 読み取り専用にするか */
  isReadonly?: boolean;
};

/**
 * 値がないときの表示値用
 *
 * @param value 値
 */
export const getTextAreaTextValue = (value: unknown) => {
  const trimValue = simpleTrim(String(value));

  if (trimValue) {
    return trimValue;
  }

  return '値がありません';
};

/**
 *
 * @returns form内のテキストエリア
 */
const TextArea: React.FC<TextAreaProps> = ({
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
  isReadonly = false,
}) => {
  const textValue = getTextAreaTextValue(value);

  return (
    <FormControl
      title={title}
      name={name}
      value={value || ''}
      textValue={textValue}
      onChange={onChange}
      onBlur={onBlur}
      hidden={hidden}
      validate={validate}
      touched={touched}
      error={error}
      dirty={dirty}
      isOnClickEditable={isOnClickEditable}
      isReadonly={isReadonly}
    >
      <Form.Control as="textarea" />
    </FormControl>
  );
};

export default TextArea;
