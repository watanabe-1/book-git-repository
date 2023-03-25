import React from 'react';
import Form from 'react-bootstrap/Form';
import { Type } from '../../@types/studyUtilType';

/**
 *
 * @returns form内のセレクトボックス
 */
const SelectBox = ({
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
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <Form.Group controlId={name}>
      {title ? <Form.Label>{title}</Form.Label> : null}
      <Form.Select name={name} onChange={onChange}>
        {typeList.map((i) => (
          <option selected={i.code == value} value={i.code}>
            {i.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectBox;
