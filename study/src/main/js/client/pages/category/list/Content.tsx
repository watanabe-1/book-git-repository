import React from 'react';

import ListTable from './ListTable';
import BodysHead from '../../../components/BodysHead';

const Content = () => {
  return (
    <div>
      <BodysHead title="カテゴリー一覧"></BodysHead>
      <ListTable />
    </div>
  );
};

export default Content;
