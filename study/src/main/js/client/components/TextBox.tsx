import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のテキストボックス
 */
const TextBox = ({
  title = null,
  name,
  value,
  onChange,
  hidden = false,
}: {
  title?: string;
  name?: string;
  value?: string | number | string[];
  onChange;
  hidden?: boolean;
}) => {
  const type = hidden ? 'hidden' : 'text';
  return (
    <Form.Group controlId={name}>
      {title && <Form.Label>{title}</Form.Label>}
      <Form.Control type={type} name={name} value={value} onChange={onChange} />
    </Form.Group>
  );
};

export default TextBox;
