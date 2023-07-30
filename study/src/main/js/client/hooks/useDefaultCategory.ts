import { useCommonSWR } from './useCommon';
import {
  DefaultCategoryFormList,
  DefaultCategoryUi,
} from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';

export const useDefaultCategoryInfoSWR = () => {
  //console.log('call useDefaultCategoryInfoSWR');
  return useCommonSWR<DefaultCategoryUi>(
    (api) => api.getInfo(),
    urlConst.defaultCategory.INFO
  );
};

export const useDefaultCategoryListSWR = () => {
  //console.log('call useDefaultCategoryListSWR');
  return useCommonSWR<DefaultCategoryFormList>(
    (api) => api.getListData(),
    urlConst.defaultCategory.LISTDATA
  );
};
