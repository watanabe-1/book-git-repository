import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { KeyedMutator } from 'swr';

import { DefaultCategoryFormList } from '../../../../../@types/studyUtilType';
import { urlConst } from '../../../../../constant/urlConstant';
import { fetchPost } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';

type InputAllButtonProps = {
  /** デフォルトカテゴリーリスト セッター */
  setList: KeyedMutator<DefaultCategoryFormList>;
};

/**
 * デフォルトカテゴリー 家計簿データから一括登録ボタン
 * @returns 一括登録ボタン
 */
const InputAllButton: React.FC<InputAllButtonProps> = ({ setList }) => {
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  // formik リセットフォーム
  const { resetForm, dirty } = useFormikContext();

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    // from送信処理の停止
    event.preventDefault();
    setSubmitLoading(true);
    const res = await fetchInputAll();
    setSubmitLoading(false);
    const json = await res.json();
    console.log('soushinkekka');
    console.log(json);
    if (res && res.ok) {
      setList(json);
      resetForm({ values: json });
    }
    return res;
  };

  /**
   * リストデータ登録
   */
  const fetchInputAll = async () => {
    return await fetchPost(urlConst.defaultCategory.INPUT_ALL);
  };

  return (
    <SubmitButton
      title="家計簿データから一括登録"
      isLoading={isSubmitLoading}
      onClick={handleSubmit}
      disabled={dirty}
    />
  );
};

export default InputAllButton;
