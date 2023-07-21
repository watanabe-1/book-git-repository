import { useCommonSWR } from './useCommon';
import {
  CategoryFormList,
  CategoryUi,
  Image,
} from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';

export const useCategoryInfoSWR = () => {
  //console.log('call useCategoryInfoSWR');
  return useCommonSWR<CategoryUi>(
    (api) => api.getInfo(),
    urlConst.category.INFO,
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useCategoryListSWR = () => {
  //console.log('call useCategoryListSWR');
  return useCommonSWR<CategoryFormList>(
    (api) => api.getListData(),
    urlConst.category.LISTDATA,
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useImageListSWR = () => {
  //console.log('call useImageListSWR');
  return useCommonSWR<Image[]>(
    (api) => api.getImageList(),
    urlConst.category.IMAGELISTDATA,
    { revalidateOnFocus: false, suspense: true }
  );
};
