import React from 'react';
import Button from 'react-bootstrap/Button';

import { urlConst } from '../../../../../constant/urlConstant';
import { addContextPath } from '../../../../../study/util/studyUtil';

type ResultProps = {
  /** 前画面へ */
  handleBack: React.MouseEventHandler<HTMLButtonElement>;
};

const Result: React.FC<ResultProps> = (props) => {
  const handleClick = () => {
    // 同一タブ内で遷移
    window.location.href = addContextPath(urlConst.category.LIST);
  };

  return (
    <div>
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title">登録完了</h5>
          <p className="card-text">カテゴリー情報の登録が完了しました。</p>
          <Button variant="primary" onClick={props.handleBack}>
            登録画面へ戻る
          </Button>
          <Button variant="primary" onClick={handleClick}>
            カテゴリー一覧画面で確認
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
