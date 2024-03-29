import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';

import { urlConst } from '../../../../../constant/urlConstant';
import { addContextPath } from '../../../../../study/util/studyUtil';

const Result = (props: {
  handleBack: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const handleClick = useCallback(() => {
    window.location.href = addContextPath(urlConst.books.HOUSEHOLD);
  }, [window.location.href]);

  return (
    <div>
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title">登録完了</h5>
          <p className="card-text">家計簿情報の登録が完了しました。</p>
          <Button variant="primary" onClick={props.handleBack}>
            登録画面へ戻る
          </Button>
          <Button variant="primary" onClick={handleClick}>
            家計簿一覧画面で確認
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
