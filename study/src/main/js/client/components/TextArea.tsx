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
      {props.title ? <Form.Label>{props.title}</Form.Label> : null}
      <Form.Control
        as="textarea"
        value={props.value}
        onChange={props.onChange}
      />
    </Form.Group>
  );
};

export default TextArea;
