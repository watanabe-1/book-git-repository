import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBoxOnValidate = ({
  title = null,
  name,
  error,
  accept,
  onChange,
}: {
  title?: string;
  name?: string;
  error?: any;
  accept?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Form.Group controlId={name}>
      {title ? <Form.Label>{title}</Form.Label> : null}
      <Form.Control
        type="file"
        accept={accept}
        onChange={onChange}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default FileBoxOnValidate;
