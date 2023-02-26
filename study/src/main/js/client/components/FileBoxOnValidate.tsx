import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBoxOnValidate = (props: {
  title: string;
  name: string;
  value: any;
  error: any;
  accept: string;
  onChange;
}) => {
  return (
    <Form.Group controlId={props.name}>
      {props.title ? <Form.Label>{props.title}</Form.Label> : null}
      <Form.Control
        type="file"
        accept={props.accept}
        onChange={props.onChange}
        isInvalid={!!props.error}
      />
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default FileBoxOnValidate;
