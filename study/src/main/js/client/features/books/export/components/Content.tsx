import React, { Suspense } from 'react';

import ExportForm from './ExportForm';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import BodysHead from '../../../../components/layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿情報出力"></BodysHead>
      <Suspense fallback={<BodysLodingSpinner />}>
        <ExportForm />
      </Suspense>
    </div>
  );
};

export default Content;
