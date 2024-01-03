import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import TabContainer from './TabContainer';
import ErrorModal from '../../../../components/elements/modal/ErrorModal';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import BodysHead from '../../../../components/layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="図色設定画面"></BodysHead>
      <ErrorBoundary FallbackComponent={ErrorModal}>
        <Suspense fallback={<BodysLodingSpinner />}>
          <TabContainer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Content;
