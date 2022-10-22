import React from 'react';
import Form from 'react-bootstrap/Form';
import TextBox from './TextBox';

/**
 *
 * @returns form内のテキストボックス(バリデーションあり)
 */
const TextBoxOnValidate = (props: {
  title: string;
  name: string;
  value: any;
  touched: any;
  error: any;
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
        isValid={props.touched && !props.error}
        isInvalid={!!props.error}
      />
      <Form.Control.Feedback>OK!</Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextBoxOnValidate;
