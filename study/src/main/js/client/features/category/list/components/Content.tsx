import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ListTable from './ListTable';
import ErrorModal from '../../../../components/elements/modal/ErrorModal';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import BodysHead from '../../../../components/layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="カテゴリー一覧"></BodysHead>
      <ErrorBoundary FallbackComponent={ErrorModal}>
        <Suspense fallback={<BodysLodingSpinner />}>
          <ListTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Content;
