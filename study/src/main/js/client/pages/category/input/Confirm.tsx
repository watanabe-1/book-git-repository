import React, { useContext } from 'react';
import { Context } from './Content';
import { fetchPost } from '../../../../study/util/studyUtil';
import { UrlConst } from '../../../../constant/urlConstant';
import ConfirmList from '../../../components/ConfirmList';
import Button from 'react-bootstrap/Button';
import { Flag, FormConfirmData, Type } from '../../../../@types/studyUtilType';
import { TypeConst } from '../../../../constant/typeConstant';
import { getConfirmMessage } from '../../../../study/util/studyMessageUtil';
import { FieldConst } from '../../../../constant/fieldConstant';

const Confirm = (props) => {
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
  item[FieldConst.Category.CAT_CODE] = {
    name: 'カテゴリーコード',
    type: TypeConst.Col.STRING,
    convert: null,
    confirmType: TypeConst.Col.STRING,
  };
  item[FieldConst.Category.CAT_NAME] = {
    name: 'カテゴリー名',
    type: TypeConst.Col.STRING,
    convert: null,
    confirmType: TypeConst.Col.STRING,
  };
  item[FieldConst.Category.NOTE] = {
    name: 'メモ',
    type: TypeConst.Col.STRING,
    convert: null,
    confirmType: TypeConst.Col.STRING,
  };
  item[FieldConst.Category.IMG_TYPE] = {
    name: '画像タイプ',
    type: TypeConst.Col.SELECT,
    convert: { typeList: info.imgTypes, flag: null },
    confirmType: TypeConst.Col.STRING,
  };
  item[FieldConst.Category.CAT_TYPE] = {
    name: 'カテゴリータイプ',
    type: TypeConst.Col.RADIO,
    convert: { typeList: info.catTypes, flag: null },
    confirmType: TypeConst.Col.STRING,
  };
  item[FieldConst.Category.ACTIVE] = {
    name: 'アクティブ',
    type: TypeConst.Col.CHECK,
    convert: { typeList: null, flag: info.active },
    confirmType: TypeConst.Col.STRING,
  };
  item[FieldConst.Category.CAT_ICON] = {
    name: 'アイコン',
    type: TypeConst.Col.IMAGE,
    convert: null,
    confirmType: TypeConst.Col.IMAGE,
  };

  const inputDataLists = [] as FormConfirmData[];
  var id = 0;
  for (const key in form) {
    inputDataLists.push({
      id: String(id++),
      name: item[key].name,
      value: getConfirmMessage(form[key], item[key].type, item[key].convert),
      type: item[key].confirmType,
    });
    id++;
  }

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
