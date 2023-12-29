import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';

import BodysLodingSpinner from '../spinner/BodysLodingSpinner';

type SubmitButtonProps = {
  /** ボタン表示 */
  title?: string;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** ローディング中かどうか */
  hidden?: boolean;
  /** クリックされたときのハンドラ関数 */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** ボタンを押下可能かどうか */
  disabled?: boolean;
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
  onClick = null,
  disabled = false,
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      //console.log('call handleTextClick');
      onClick?.(event);
    },
    [onClick]
  );

  return isLoading ? (
    <Button variant="outline-primary" disabled hidden={hidden}>
      <BodysLodingSpinner />
    </Button>
  ) : (
    <Button
      variant="primary"
      type="submit"
      hidden={hidden}
      onClick={handleClick}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default SubmitButton;
