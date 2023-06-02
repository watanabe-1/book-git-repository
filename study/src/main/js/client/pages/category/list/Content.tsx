import React from 'react';

import BodysHead from '../../../components/BodysHead';
import ListTable from './ListTable';

const Content = () => {
  return (
    <div>
      <BodysHead title="カテゴリー一覧"></BodysHead>
      <ListTable />
    </div>
  );
};

export default Content;
