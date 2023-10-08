import React from 'react';
import Form from 'react-bootstrap/Form';

import FormControl from './FormControl';

type FileBoxProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value?: string | number | string[];
  /** テキストとして表示する値 */
  textValue?: string;
  /** 選択できるデフォルトファイルタイプ */
  accept: string;
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
  error?: unknown | null;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 読み取り専用にするか */
  isReadonly?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
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
  textValue,
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

  return (
    <FormControl
      title={title}
      name={name}
      value={value || ''}
      textValue={textValue ? textValue : String(value)}
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
