import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ExportForm from './ExportForm';
import ErrorModal from '../../../../components/elements/modal/ErrorModal';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import BodysHead from '../../../../components/layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿情報出力"></BodysHead>
      <ErrorBoundary FallbackComponent={ErrorModal}>
        <Suspense fallback={<BodysLodingSpinner />}>
          <ExportForm />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Content;
