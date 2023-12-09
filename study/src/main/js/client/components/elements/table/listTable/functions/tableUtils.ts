import { TableColumn, TableRow } from '../../../../../../@types/studyUtilType';
import {
  hiraToKata,
  normalizeString,
} from '../../../../../../study/util/studyStringUtil';
import { isNumber } from '../../../../../../study/util/studyUtil';

/** ソート順 昇順 */
export const ASCENDING = 'ASC';
/** ソート順 降順 */
export const DESCENDING = 'DESC';

export type SortDirection = 'ASC' | 'DESC';

/**
 * nameが一致するcellを取得
 *
 * @param row TableRow
 * @param name cell名
 * @returns cell
 */
export const findCell = (row: TableRow, name: string) =>
  row.cells.find((cell) => cell.name === name);

/**
 * テーブル行をフィルターする
 *
 * @param rows 行
 * @param columns カラム
 * @param normalizeBeforeFilter 正規化するか
 * @param caseSensitiveBeforeFilter 大文字小文字を区別するか
 * @param separateHiraganaKatakanaBeforeFilter ひらがなかたかなを区別するか
 * @param isFilter フィルターするか
 */
export const filterRows = (
  rows: TableRow[],
  columns: TableColumn[],
  normalizeBeforeFilter: boolean,
  caseSensitiveBeforeFilter: boolean,
  separateHiraganaKatakanaBeforeFilter: boolean,
  isFilter: boolean
) => {
  if (!isFilter) return rows;

  return rows.map((row) => {
    row.hidden = !columns.every((column) => {
      if (column.filterValue === '') {
        return true;
      }
      const cell = findCell(row, column.name);

      let rowValue = String(cell.textValue);
      let colValaue = String(column.filterValue);

      // 正規化する(主に半角全角などを区別したくないときに使用する想定)
      if (normalizeBeforeFilter) {
        rowValue = normalizeString(rowValue);
        colValaue = normalizeString(colValaue);
      }

      // 大文字小文字を区別しない
      if (!caseSensitiveBeforeFilter) {
        rowValue = rowValue.toLowerCase();
        colValaue = colValaue.toLowerCase();
      }

      // ひらがなとカタカナを区別しない
      if (!separateHiraganaKatakanaBeforeFilter) {
        rowValue = hiraToKata(rowValue);
        colValaue = hiraToKata(colValaue);
      }

      return rowValue.includes(colValaue);
    });

    return row;
  });
};

/**
 * テーブル行をソート
 *
 * @param rows 行
 * @param sortColumn ソート対象カラム
 * @param sortDirection ソート順
 * @param isSort ソートするか
 * @returns
 */
export const sortRows = (
  rows: TableRow[],
  sortColumn: string,
  sortDirection: SortDirection,
  isSort: boolean
) => {
  if (!(sortColumn && isSort)) return rows;

  // sortは自身を変更してしまう破壊的な関数なため、浅いコピーに対してsortを実行するようにする
  return [...rows].sort((aRow, bRow) => {
    const aCell = findCell(aRow, sortColumn);
    const bCell = findCell(bRow, sortColumn);
    let aValue: string | number = aCell.textValue;
    let bValue: string | number = bCell.textValue;

    if (isNumber(aValue) && isNumber(bValue)) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) {
      return sortDirection === ASCENDING ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === ASCENDING ? 1 : -1;
    }
    return 0;
  });
};

/**
 * サジェストをフィルターする
 *
 * @param rows 行
 * @param columns カラム
 * @param isSuggestions サジェストするか
 * @param maxSuggestions 最大サジェスト数
 * @returns
 */
export const filterSuggestions = (
  rows: TableRow[],
  columns: TableColumn[],
  isSuggestions: boolean,
  maxSuggestions: number
) => {
  if (!isSuggestions) return [];

  // サジェスト対象
  const column = columns.find((column) => column.showSuggestions);
  // columnが見つからないときは、どのボックスもサジェスト対象になっていないとき
  if (!column) return [];

  return (
    rows
      .filter((row) => !row.hidden)
      .map((row) => findCell(row, column.name).textValue)
      // 重複除外
      .filter((textValue, index, self) => self.indexOf(textValue) === index)
      .slice(0, maxSuggestions)
  );
};
