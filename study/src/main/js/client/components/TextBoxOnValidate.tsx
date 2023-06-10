import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のテキストボックス(バリデーションあり)
 */
const TextBoxOnValidate = ({
  title = null,
  name,
  value,
  touched,
  error,
  onChange,
}: {
  title?: string;
  name: string;
  value: string | number | string[];
  touched: unknown;
  error: unknown;
  onChange;
}) => {
  return (
    <Form.Group controlId={name}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        isValid={touched && !error}
        isInvalid={!!error}
      />
      <Form.Control.Feedback>OK!</Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">
        {
          // エラー回避 対応策わかり次第変更
          error as string
        }
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextBoxOnValidate;
