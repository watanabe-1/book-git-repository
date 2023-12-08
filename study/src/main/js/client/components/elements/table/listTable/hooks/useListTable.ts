import { useState } from 'react';

import { TableColumn } from '../../../../../../@types/studyUtilType';
import {
  ASCENDING,
  DESCENDING,
  SortDirection,
  filterRows,
  filterSuggestions,
  sortRows,
} from '../functions/tableUtils';
import { ListTableProps } from '../types/listTableProps';

export const useListTable = ({
  columns: pColumns,
  rows: pRows,
  isSort,
  isFilter,
  isSuggestions,
  maxSuggestions,
  normalizeBeforeFilter,
  caseSensitiveBeforeFilter,
  separateHiraganaKatakanaBeforeFilter,
}: ListTableProps) => {
  // use stateでJSX.Elementを管理しようとすると、JSX.Elementに紐づいている
  // eventが正常に動作しなくなったため、JSX.Elementが入っているpRowsはuseState
  // で管理しない
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(ASCENDING);
  const [columns, setColumns] = useState(pColumns);

  /**
   *  サジェスト関係stateの更新
   *
   * @param column TableColumn
   * @param showSuggestions
   * @param activeSuggestionIndex
   */
  const setSuggestions = (
    column: TableColumn,
    showSuggestions: boolean,
    activeSuggestionIndex: number
  ) => {
    setColumns((newColumns) =>
      newColumns.map((c) =>
        c.name === column.name
          ? { ...c, showSuggestions, activeSuggestionIndex }
          : c
      )
    );
  };

  /**
   * 並び替えの条件のセット
   * セットを行うとレンダリングが行われセットした値によって並び替えが実施される想定
   *
   * @param column TableColumn
   */
  const handleSort = (column: TableColumn) => {
    if (!isSort) return;

    const newDirection =
      sortColumn === column.name && sortDirection === ASCENDING
        ? DESCENDING
        : ASCENDING;
    setSortColumn(column.name);
    setSortDirection(newDirection);
  };

  /**
   * 絞り込みを行うフィルター条件のセット
   * セットを行うとレンダリングが行われセットした値によって絞り込みが実施される想定
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleFilterChange = (column: TableColumn, value: string) => {
    if (!isFilter) return;

    setColumns((newColumns) =>
      newColumns.map((c) =>
        c.name === column.name ? { ...c, filterValue: value } : c
      )
    );
    setSuggestions(column, true, 0);
  };

  /**
   * 最初に入力ボックスをクリックしたらサジェストを出す
   *
   * @param column TableColumn
   */
  const handleSuggestionClick = (column: TableColumn) => {
    //console.log('call handleSuggestionClick');
    // 値をセット
    if (!isSuggestions) return;

    setSuggestions(column, true, 0);
  };

  /**
   * サジェストに出した値を入力値としてセット
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleSuggestionItemClick = (column: TableColumn, value: string) => {
    //console.log('call handleSuggestionItemClick');
    // 値をセット
    if (!isSuggestions) return;

    handleFilterChange(column, value);
  };

  /**
   * フォーカスが外れたときはサジェストを表示しない
   * @param column TableColumn
   */
  const handleSuggestionBlur = (column: TableColumn) => {
    // console.log('call handleSuggestionFocus');
    if (!isSuggestions) return;

    // フォーカスが外れたときはサジェストを表示しない
    // サジェストリスト内の項目をクリックする時、
    // リストがすぐに非表示にならないようにする
    // ためにsetTimeout を使用
    // リストが非表示になるまで処理を遅延し、
    // ユーザーが項目をクリックするための時間を確保する
    setTimeout(() => {
      //console.log('call setTimeout handleSuggestionFocus');
      setSuggestions(column, false, 0);
    }, 250);
  };

  /**
   * サジェスト対象を十字キーで選択できるようにする
   *
   * @param e イベント
   * @param column TableColumn
   * @param filteredSuggestions サジェスト対象
   * @returns
   */
  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    column: TableColumn,
    filteredSuggestions: string[]
  ) => {
    if (
      isSuggestions &&
      column.showSuggestions &&
      filteredSuggestions.length > 0
    ) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFilterChange(
          column,
          filteredSuggestions[column.activeSuggestionIndex]
        );
        setSuggestions(column, false, 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (column.activeSuggestionIndex <= 0) {
          setSuggestions(column, true, filteredSuggestions.length - 1);
          return;
        }
        setSuggestions(column, true, column.activeSuggestionIndex - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (column.activeSuggestionIndex >= filteredSuggestions.length - 1) {
          setSuggestions(column, true, 0);
          return;
        }
        setSuggestions(column, true, column.activeSuggestionIndex + 1);
      }
    } else if (
      isSuggestions &&
      // サジェストが出てないとき
      !column.showSuggestions
    ) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        // filteredSuggestionsがないとき
        if (filteredSuggestions.length <= 0) {
          setSuggestions(column, true, 0);
          return;
        }
        setSuggestions(column, true, filteredSuggestions.length - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestions(column, true, 0);
      }
    }
  };

  // 行をフィルター
  const filterdRows = filterRows(
    pRows,
    columns,
    normalizeBeforeFilter,
    caseSensitiveBeforeFilter,
    separateHiraganaKatakanaBeforeFilter,
    isFilter
  );

  // 行をソート
  const filteredAndSortedRows = sortRows(
    filterdRows,
    sortColumn,
    sortDirection,
    isSort
  );

  // サジェストの作成
  const filteredSuggestions = filterSuggestions(
    filteredAndSortedRows,
    columns,
    isSuggestions,
    maxSuggestions
  );

  return {
    sortColumn,
    sortDirection,
    columns,
    setSuggestions,
    setColumns,
    handleSort,
    handleFilterChange,
    handleSuggestionClick,
    handleSuggestionItemClick,
    handleSuggestionBlur,
    handleSuggestionKeyDown,
    filteredAndSortedRows,
    filteredSuggestions,
  };
};
