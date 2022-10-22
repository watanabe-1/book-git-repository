import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

/**
 *
 * @returns bodyローディング時のスピナー
 */
const BodysLodingSpinner = () => {
  return (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />
  );
};

export default BodysLodingSpinner;
