import React, { Suspense } from 'react';

import TabContainer from './TabContainer';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import BodysHead from '../../../../components/layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿確認画面" />
      <Suspense fallback={<BodysLodingSpinner />}>
        <TabContainer />
      </Suspense>
    </div>
  );
};

export default Content;
