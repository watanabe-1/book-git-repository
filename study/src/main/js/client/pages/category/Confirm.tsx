import React, { useContext } from 'react';
import { Context } from './Content';
import { fetchPost } from '../../../study/util/studyUtil';
import { UrlConst } from '../../../constant/urlConstant';
import ConfirmList from '../../components/ConfirmList';
import Button from 'react-bootstrap/Button';

const Confirm = (props) => {
  const { currentState } = useContext(Context);

  const onSubmit = async () => {
    //alert(JSON.stringify(currentState));
    const res = await fetchPost(UrlConst.Category.RESULT, currentState.form);
    if (res.ok) {
      // 確認画面へ
      props.handleNext();
    } else {
      props.handleBack();
    }
  };

  return (
    <div>
      <ConfirmList listData={currentState.confirm} />
      <Button variant="primary" onClick={props.handleBack}>
        戻る
      </Button>
      <Button variant="primary" onClick={onSubmit}>
        送信
      </Button>
    </div>
  );
};

export default Confirm;
