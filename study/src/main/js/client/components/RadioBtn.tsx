import React from 'react';
import Form from 'react-bootstrap/Form';
import { Type } from '../../@types/studyUtilType';

/**
 *
 * @returns form内のラジオボタン
 */
const RadioBtn = ({
  title = null,
  name,
  value,
  typeList,
  onChange,
}: {
  title?: string;
  name: string;
  value: string;
  typeList: Type[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Form.Group controlId={name}>
      {title ? <Form.Label>{title}</Form.Label> : null}
      <br />
      {typeList.map((i) => (
        <Form.Check
          type="radio"
          inline
          value={i.code}
          label={i.name}
          checked={i.code == value}
          onChange={onChange}
        />
      ))}
    </Form.Group>
  );
};

export default RadioBtn;
