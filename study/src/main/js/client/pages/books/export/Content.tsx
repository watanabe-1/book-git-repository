import React from 'react';
import BodysHead from '../../../components/BodysHead';
import ExportForm from './ExportForm';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿情報出力"></BodysHead>
      <ExportForm />
    </div>
  );
};

export default Content;
