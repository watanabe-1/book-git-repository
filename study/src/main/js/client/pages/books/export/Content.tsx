import React from 'react';

import ExportForm from './ExportForm';
import BodysHead from '../../../components/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿情報出力"></BodysHead>
      <ExportForm />
    </div>
  );
};

export default Content;
