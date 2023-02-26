import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のテキストボックス
 */
const TextBox = ({
  title,
  name,
  value,
  onChange,
  hidden = false,
}: {
  title?: string;
  name: string;
  value?: any;
  onChange?;
  hidden?: boolean;
}) => {
  return (
    <Form.Group controlId={name}>
      {title ? <Form.Label>{title}</Form.Label> : null}
      <Form.Control
        type={hidden ? 'hidden' : 'text'}
        name={name}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

export default TextBox;
