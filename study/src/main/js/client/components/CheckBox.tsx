import React from 'react';
import Form from 'react-bootstrap/Form';

import { Flag } from '../../@types/studyUtilType';

/**
 *
 * @returns form内のチェックボックス
 */
const CheckBox = ({
  name,
  value,
  flag,
  onChange,
}: {
  name: string;
  value: string;
  flag: Flag;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Form.Group controlId={name}>
      <Form.Check
        type="checkbox"
        value={flag.value}
        label={flag.name}
        // flagに入る値(1,true)などどちらも対応できるように===は使用しない
        checked={flag.value == value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

export default CheckBox;
