import { useCommonSWR } from './useCommon';
import {
  BooksUi,
  BooksConvertUi,
  HouseholdUi,
} from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';
import { HouseholdCalendarData } from '../features/books/household/components/Calendar';
import { HouseholdChartData } from '../features/books/household/components/Chart';

export const useConvertInfoSWR = () => {
  //console.log('call useConvertInfoSWR');
  return useCommonSWR<BooksConvertUi>(
    (api) => api.getConvertInfo(),
    urlConst.books.CONVERT_INFO,
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useDownloadtInfoSWR = () => {
  //console.log('call useDownloadtInfoSWR');
  return useCommonSWR<BooksUi>(
    (api) => api.getDownloadInfo(),
    urlConst.books.DOWNLOAD_INFO,
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useUploadtInfoSWR = () => {
  //console.log('call useUploadtInfoSWR');
  return useCommonSWR<BooksUi>(
    (api) => api.getUploadInfo(),
    urlConst.books.UPLOAD_INFO,
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useHouseholdInfoSWR = (token: Record<string, string>) => {
  //console.log('call useHouseholdInfoSWR');
  return useCommonSWR<HouseholdUi>(
    (api, param) => api.getHouseholdInfo(param),
    [urlConst.books.HOUSEHOLD_INFO, token],
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useHouseholdChartInfoSWR = (token: Record<string, string>) => {
  //console.log('call useHouseholdChartInfoSWR');
  return useCommonSWR<HouseholdChartData>(
    (api, param) => api.getHouseholdChartInfo(param),
    [urlConst.books.HOUSEHOLD_CHART_INFO, token],
    { revalidateOnFocus: false, suspense: true }
  );
};

export const useHouseholdCalendarInfoSWR = (token?: Record<string, string>) => {
  //console.log('call useHouseholdCalendarInfoSWR');
  return useCommonSWR<HouseholdCalendarData>(
    (api, param) => api.getHouseholdCalendarInfo(param),
    [urlConst.books.HOUSEHOLD_CALENDAR_INFO, token],
    { revalidateOnFocus: false, suspense: true }
  );
};
