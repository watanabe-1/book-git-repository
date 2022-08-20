import React from 'react';

/**
 *
 * @returns body内で一番上に設置
 */
const BodysHesd = (props: { title: string }) => {
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h3">{props.title}</h1>
      <div className="btn-group ml-auto"></div>
    </div>
  );
};

export default BodysHesd;
