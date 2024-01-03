import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ConvertForm from './ConvertForm';
import BodysHead from '../../../../components//layout/BodysHead';
import ErrorModal from '../../../../components/elements/modal/ErrorModal';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';

const Content = () => {
  return (
    <div>
      <BodysHead title="家計簿外データ変換"></BodysHead>
      <ErrorBoundary FallbackComponent={ErrorModal}>
        <Suspense fallback={<BodysLodingSpinner />}>
          <ConvertForm />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Content;
