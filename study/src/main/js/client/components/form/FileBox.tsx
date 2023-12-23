import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './formControl/FormControl';
import { simpleTrim } from '../../../study/util/studyStringUtil';

type FileBoxProps = {
  /** ファイルボックスのタイトル */
  title?: string;
  /** ファイルボックスの名前 */
  name: string;
  /** ファイルボックスの値 */
  value?: File;
  /** テキストとして表示する値 */
  textValue?: string;
  /** 選択できるデフォルトファイルタイプ */
  accept: string;
  /** ファイルボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** ファイルボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** ファイルボックスを非表示にするかどうか */
  hidden?: boolean;
  /** バリデーションを行うかどうかを示すフラグ */
  validate?: boolean;
  /** バリデーションが実行されたかどうかを示すフラグ */
  touched?: boolean;
  /** エラーメッセージ */
  error?: unknown | null;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 読み取り専用にするか */
  isReadonly?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
};

/**
 * 値がないときの表示用
 *
 * @param value 値
 */
export const getFileBoxTextValue = (value: unknown) => {
  const trimValue = simpleTrim(String(value));

  if (trimValue) {
    return trimValue;
  }

  return '値がありません';
};

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBox: React.FC<FileBoxProps> = ({
  title = null,
  name,
  accept,
  value = null,
  textValue: pTextValue,
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
  const type = hidden ? 'hidden' : 'file';
  const textValue = pTextValue ? pTextValue : getFileBoxTextValue(value);

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
      <Form.Control type={type} accept={accept} />
    </FormControl>
  );
};

export default FileBox;
