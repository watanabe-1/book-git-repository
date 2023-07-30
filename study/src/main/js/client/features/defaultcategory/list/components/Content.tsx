import React, { Suspense } from 'react';

import ListTable from './ListTable';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import BodysHead from '../../../../components/layout/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="デフォルトカテゴリー一覧"></BodysHead>
      <Suspense fallback={<BodysLodingSpinner />}>
        <ListTable />
      </Suspense>
    </div>
  );
};

export default Content;
