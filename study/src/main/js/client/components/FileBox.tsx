import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のファイル用インプットボックス
 */
/**
 * @param title - テキストボックスのタイトル
 * @param name - テキストボックスの名前
 * @param accept - ファイルタイプ
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @returns form内のファイル用インプットボックス
 */
const FileBox = ({
  title = null,
  name,
  accept,
  onChange,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
}: {
  title?: string;
  name: string;
  accept: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hidden?: boolean;
  validate?: boolean;
  touched?: unknown;
  error?: unknown;
}) => {
  const type = hidden ? 'hidden' : 'file';
  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;

  return (
    <Form.Group controlId={name}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control
        type={type}
        name={name}
        accept={accept}
        onChange={onChange}
        isValid={isValid}
        isInvalid={isInvalid}
      />
      {validate && <Form.Control.Feedback>OK!</Form.Control.Feedback>}
      {validate && (
        <Form.Control.Feedback type="invalid">
          {error as string}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FileBox;
