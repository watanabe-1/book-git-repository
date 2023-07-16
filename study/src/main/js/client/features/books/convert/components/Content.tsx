import React from 'react';

import ConvertForm from './ConvertForm';
import BodysHead from '../../../../components//layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿外データ変換"></BodysHead>
      <ConvertForm />
    </div>
  );
};

export default Content;
