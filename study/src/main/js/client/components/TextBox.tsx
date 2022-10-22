import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のテキストボックス
 */
const TextBox = (props: {
  title: string;
  name: string;
  value: any;
  onChange;
}) => {
  return (
    <Form.Group controlId={props.name}>
      <Form.Label>{props.title}</Form.Label>
      <Form.Control
        type="text"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    </Form.Group>
  );
};

export default TextBox;
