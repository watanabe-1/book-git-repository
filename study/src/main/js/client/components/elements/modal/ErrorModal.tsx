import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FallbackProps } from 'react-error-boundary';

import {
  addContextPath,
  isErrorAuthExpired,
} from '../../../../study/util/studyUtil';
// ErrorModal コンポーネントの props の型を定義
interface ErrorModalProps extends FallbackProps {}

/**
 * error boundaryに設定する用のモーダルポップアップ
 *
 * @returns
 */
const ErrorModal: React.FC<ErrorModalProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const [show, setShow] = useState(true);
  const msg = isErrorAuthExpired(error)
    ? 'ログイン情報の有効期限が切れています。再度ログインしてください。'
    : '何らかの問題が発生しました。ページをリロードするか、時間をおいて再度お試しください。';

  // エラー情報をコンソールに出力
  useEffect(() => {
    console.error('An error has been detected:', error);
  }, [error]);

  const handleClose = () => {
    // CSRFトークンが無効または期限切れの場合、401エラーが返却される
    if (isErrorAuthExpired(error)) {
      // トップページに遷移
      window.location.href = addContextPath('/');

      // window.location.hrefから遷移を行う場合は、returnでほかの処理が実行されないようにする
      return;
    }

    setShow(false);
    resetErrorBoundary();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>エラーが発生しました</Modal.Title>
      </Modal.Header>
      <Modal.Body>{msg}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
