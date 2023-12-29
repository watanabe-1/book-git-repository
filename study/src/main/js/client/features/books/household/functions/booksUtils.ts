import { Books, HouseholdUi } from '../../../../../@types/studyUtilType';
import { createDate } from '../../../../../study/util/studyDateUtil';

/**
 * HouseholdUiからDateを取得
 *
 * @param data HouseholdUi
 * @return Date
 */
export const infoToDate = (data: HouseholdUi) =>
  createDate(data.year, data.month, data.day);

/**
 * 家計簿データの金額の合計を取得する
 *
 * @param booksList 家計簿データの配列
 */
export const sumAmount = (booksList: Books[]) => {
  return booksList.reduce((sum, books) => sum + Number(books.booksAmmount), 0);
};
