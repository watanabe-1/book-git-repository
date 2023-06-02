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
      {title && <span>{title}</span>}
      <br />
      {typeList.map((type, index) => (
        <Form.Check
          type="radio"
          inline
          name={name}
          id={`${name}-${index}`}
          value={type.code}
          label={type.name}
          checked={type.code == value}
          onChange={onChange}
        />
      ))}
    </Form.Group>
  );
};

export default RadioBtn;
