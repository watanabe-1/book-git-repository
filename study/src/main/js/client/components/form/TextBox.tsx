import React, { useMemo } from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './formControl/FormControl';
import { simpleTrim } from '../../../study/util/studyStringUtil';

type TextBoxProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value: string | number | string[];
  /** 初期値(valueとの比較用) */
  initialValue: string | number | string[];
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
 * textbox初期値設定用関数
 * string型が来ないことが分かっている個所
 * やnullが入る可能制がある箇所で使用する想定
 *
 * @param value 値
 * @returns
 */
export const modifierTextBox = (value: unknown) => {
  if (value == 0 || value) {
    return simpleTrim(String(value));
  }

  return '';
};

/**
 * 値がないときの表示値用
 *
 * @param value 値
 */
export const getTextBoxTextValue = (value: unknown) => {
  const trimValue = simpleTrim(String(value));

  if (trimValue) {
    return trimValue;
  }

  return '値がありません';
};

/**
 * @returns form内のテキストボックス
 */
const TextBox: React.FC<TextBoxProps> = ({
  title = null,
  name,
  value,
  initialValue,
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
  const type = hidden ? 'hidden' : 'text';
  const textValue = useMemo(() => getTextBoxTextValue(value), [value]);

  return (
    <FormControl
      title={title}
      name={name}
      value={value || ''}
      initialValue={initialValue || ''}
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
      <Form.Control type={type} />
    </FormControl>
  );
};

export default TextBox;
