import React, { Suspense } from 'react';

import ConvertForm from './ConvertForm';
import BodysHead from '../../../../components//layout/BodysHead';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿外データ変換"></BodysHead>
      <Suspense fallback={<BodysLodingSpinner />}>
        <ConvertForm />
      </Suspense>
    </div>
  );
};

export default Content;
