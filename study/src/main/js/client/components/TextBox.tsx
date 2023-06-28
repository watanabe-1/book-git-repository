import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 * @param title - テキストボックスのタイトル
 * @param name - テキストボックスの名前
 * @param value - テキストボックスの値
 * @param onChange - テキストボックスの値が変更されたときのハンドラ関数
 * @param hidden - テキストボックスを非表示にするかどうか
 * @param validate - バリデーションを行うかどうかを示すフラグ
 * @param touched - バリデーションが実行されたかどうかを示すフラグ
 * @param error - エラーメッセージ
 * @returns form内のテキストボックス
 */
const TextBox = ({
  title = null,
  name,
  value,
  onChange,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
}: {
  title?: string;
  name: string;
  value: string | number | string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hidden?: boolean;
  validate?: boolean;
  touched?: unknown;
  error?: unknown;
}) => {
  const type = hidden ? 'hidden' : 'text';
  const isValid = validate && touched && !error;
  const isInvalid = validate && !!error;

  return (
    <Form.Group controlId={name}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control
        type={type}
        name={name}
        value={value}
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

export default TextBox;
