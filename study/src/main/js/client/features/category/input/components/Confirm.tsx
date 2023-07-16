import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import { Context } from './Content';
import {
  Type,
  Flag,
  FormConfirmData,
} from '../../../../../@types/studyUtilType';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { typeConst } from '../../../../../constant/typeConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getConfirmMessage } from '../../../../../study/util/studyMessageUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import ConfirmList from '../../../../components/form/ConfirmList';

type ConfirmProps = {
  /** 次画面へ */
  handleNext: () => void;
  /** 前画面へ */
  handleBack: () => void;
};

const Confirm: React.FC<ConfirmProps> = (props) => {
  const { currentState } = useContext(Context);
  const form = currentState.form;
  const info = currentState.info;

  type Item = {
    key: {
      name: string;
      type: string;
      convert: { typeList: Type[]; flag: Flag };
      confirmType: string;
    };
  };

  const item = {} as Item;
  item[fieldConst.category.CAT_CODE] = {
    name: 'カテゴリーコード',
    type: typeConst.col.STRING,
    convert: null,
    confirmType: typeConst.col.STRING,
  };
  item[fieldConst.category.CAT_NAME] = {
    name: 'カテゴリー名',
    type: typeConst.col.STRING,
    convert: null,
    confirmType: typeConst.col.STRING,
  };
  item[fieldConst.category.NOTE] = {
    name: 'メモ',
    type: typeConst.col.STRING,
    convert: null,
    confirmType: typeConst.col.STRING,
  };
  item[fieldConst.category.IMG_TYPE] = {
    name: '画像タイプ',
    type: typeConst.col.SELECT,
    convert: { typeList: info.imgTypes, flag: null },
    confirmType: typeConst.col.STRING,
  };
  item[fieldConst.category.CAT_TYPE] = {
    name: 'カテゴリータイプ',
    type: typeConst.col.RADIO,
    convert: { typeList: info.catTypes, flag: null },
    confirmType: typeConst.col.STRING,
  };
  item[fieldConst.category.ACTIVE] = {
    name: 'アクティブ',
    type: typeConst.col.CHECK,
    convert: { typeList: null, flag: info.active },
    confirmType: typeConst.col.STRING,
  };
  item[fieldConst.category.CAT_ICON] = {
    name: 'アイコン',
    type: typeConst.col.IMAGE,
    convert: null,
    confirmType: typeConst.col.IMAGE,
  };

  const inputDataLists = [] as FormConfirmData[];
  let id = 0;
  for (const key in form) {
    inputDataLists.push({
      id: String(id++),
      name: item[key].name,
      value: getConfirmMessage(form[key], item[key].type, item[key].convert),
      type: item[key].confirmType,
    });
  }

  const onSubmit = async () => {
    //alert(JSON.stringify(currentState));
    const res = await fetchPost(urlConst.category.RESULT, currentState.form);
    if (res.ok) {
      // 確認画面へ
      props.handleNext();
    } else {
      props.handleBack();
    }
  };

  return (
    <div>
      <ConfirmList listData={inputDataLists} />
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
