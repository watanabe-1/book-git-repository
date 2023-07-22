/**
 * api
 */
export type OnServerApi = {
  getCommonInfo(): string;
  getImageList: () => string;
  getListData: () => string;
  getInfo: () => string;
  getHouseholdInfo: (date: Date) => string;
  getHouseholdCalendarInfo: (date: Date) => string;
  getHouseholdChartInfo: (date: Date) => string;
  getDownloadInfo: () => string;
  getUploadInfo: () => string;
  getConvertInfo: () => string;
};
