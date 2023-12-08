import { TableColumn, TableRow } from '../../../../../../@types/studyUtilType';

export type ListTableProps = {
  /** 列 */
  columns: TableColumn[];
  /** 行 */
  rows: TableRow[];
  /** ヘッダーをクリックしたときにソートを行うか */
  isSort?: boolean;
  /** ヘッダーにフィルター用検索ボックスを設置するか */
  isFilter?: boolean;
  /** サジェストをフィルター用検索ボックスに表示するか*/
  isSuggestions?: boolean;
  /** サジェストの表示件数 -数値を指定で全件表示*/
  maxSuggestions?: number;
  /** 正規化してから絞り込みをかけるか(主に半角、全角を区別なく検索できるようにするために使用する想定) */
  normalizeBeforeFilter?: boolean;
  /** 大文字小文字を区別して絞り込みをかけるか */
  caseSensitiveBeforeFilter?: boolean;
  /** ひらがなとかたかなを区別して絞り込みをかけるか*/
  separateHiraganaKatakanaBeforeFilter?: boolean;
};
