import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のテキストエリア
 */
const TextArea = ({
  title = null,
  name,
  value,
  onChange,
}: {
  title?: string;
  name: string;
  value: string | number | string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Form.Group controlId={name}>
      {title ? <Form.Label>{title}</Form.Label> : null}
      <Form.Control
        as="textarea"
        value={value ? value : ''}
        onChange={onChange}
      />
    </Form.Group>
  );
};

export default TextArea;
