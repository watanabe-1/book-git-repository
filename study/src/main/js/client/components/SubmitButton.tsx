import React from 'react';
import Button from 'react-bootstrap/Button';
import BodysLodingSpinner from './BodysLodingSpinner';

/**
 * title ボタン表示
 * isLoading ローディング中かどうか
 * @returns 送信用ボタン
 */
const SubmitButton = ({
  title,
  isLoading = false,
  hidden = false,
}: {
  title?: string;
  isLoading?: boolean;
  hidden?: boolean;
}) => {
  return isLoading ? (
    <Button variant="outline-primary" disabled hidden={hidden}>
      <BodysLodingSpinner />
    </Button>
  ) : (
    <Button variant="primary" type="submit" hidden={hidden}>
      {title}
    </Button>
  );
};

export default SubmitButton;
