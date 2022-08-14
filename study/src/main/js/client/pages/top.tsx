import React from 'react';
import { initialize } from '../init';

/**
 *
 * @returns トップ
 */
const Top = () => {
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h3">ダッシュボード</h1>
      <div className="btn-group ml-auto"></div>
    </div>
  );
};

initialize(Top);
