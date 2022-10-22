import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のテキストエリア
 */
const TextArea = (props: {
  title: string;
  name: string;
  value: any;
  onChange;
}) => {
  return (
    <Form.Group controlId={props.name}>
      <Form.Label>{props.title}</Form.Label>
      <Form.Control
        as="textarea"
        value={props.value}
        onChange={props.onChange}
      />
    </Form.Group>
  );
};

export default TextArea;
