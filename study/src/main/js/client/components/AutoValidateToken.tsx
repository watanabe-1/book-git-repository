import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';

import { ErrorResults } from '../../@types/studyUtilType';

type AutoValidateTokenProps = {
  errData: ErrorResults;
};

/**
 * エラーデータに変更があった場合(サーバーエラーの場合を主に想定)バリデーション実施
 * formikが使用されているformの中で必ず使用すること
 *
 * @returns
 */
const AutoValidateToken: React.FC<AutoValidateTokenProps> = ({ errData }) => {
  // formikバリデーション
  const { validateForm } = useFormikContext();

  // エラーデータに変更があった場合(サーバーエラーの場合を主に想定)バリデーション実施
  useEffect(() => {
    if (errData) {
      validateForm();
      // console.log('call validateForm from AutoValidateToken');
    }
    //console.log('call useEffect from AutoValidateToken');
  }, [errData]);

  return null;
};
export default AutoValidateToken;
