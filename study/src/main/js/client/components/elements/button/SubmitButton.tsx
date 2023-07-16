import React from 'react';
import Button from 'react-bootstrap/Button';

import BodysLodingSpinner from '../spinner/BodysLodingSpinner';

type SubmitButtonProps = {
  /** ボタン表示 */
  title?: string;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** ローディング中かどうか */
  hidden?: boolean;
};

/**
 * 送信用ボタン
 *
 * @returns 送信用ボタン
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  isLoading = false,
  hidden = false,
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
