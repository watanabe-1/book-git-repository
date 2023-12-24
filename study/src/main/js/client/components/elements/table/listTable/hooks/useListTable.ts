import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useMemo, useState } from 'react';

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

export type UseListTableProps = ListTableProps & {
  /** table containerのref */
  tableContainerRef: React.MutableRefObject<HTMLDivElement>;
};

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
  tableContainerRef,
  rowHight,
}: UseListTableProps) => {
  // use stateでJSX.Elementを管理しようとすると、JSX.Elementに紐づいている
  // eventが正常に動作しなくなったため、JSX.Elementが入っているpRowsはuseState
  // で管理しない
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(ASCENDING);
  const [columns, setColumns] = useState(pColumns);

  //console.log('call useListTable');

  /**
   *  サジェスト関係stateの更新
   *
   * @param column TableColumn
   * @param showSuggestions
   * @param activeSuggestionIndex
   */
  const setSuggestions = useCallback(
    (
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
    },
    []
  );

  /**
   * 並び替えの条件のセット
   * セットを行うとレンダリングが行われセットした値によって並び替えが実施される想定
   *
   * @param column TableColumn
   */
  const handleSort = useCallback(
    (column: TableColumn) => {
      if (!isSort) return;

      const newDirection =
        sortColumn === column.name && sortDirection === ASCENDING
          ? DESCENDING
          : ASCENDING;
      setSortColumn(column.name);
      setSortDirection(newDirection);
    },
    [isSort, sortDirection, sortColumn]
  );

  /**
   * 絞り込みを行うフィルター条件のセット
   * セットを行うとレンダリングが行われセットした値によって絞り込みが実施される想定
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleFilterChange = useCallback(
    (column: TableColumn, value: string) => {
      if (!isFilter) return;

      setColumns((newColumns) =>
        newColumns.map((c) =>
          c.name === column.name ? { ...c, filterValue: value } : c
        )
      );
      setSuggestions(column, true, 0);
    },
    [isFilter, setSuggestions]
  );

  /**
   * 最初に入力ボックスをクリックしたらサジェストを出す
   *
   * @param column TableColumn
   */
  const handleSuggestionClick = useCallback(
    (column: TableColumn) => {
      //console.log('call handleSuggestionClick');
      // 値をセット
      if (!isSuggestions) return;

      setSuggestions(column, true, 0);
    },
    [isSuggestions, setSuggestions]
  );

  /**
   * サジェストに出した値を入力値としてセット
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleSuggestionItemClick = useCallback(
    (column: TableColumn, value: string) => {
      //console.log('call handleSuggestionItemClick');
      // 値をセット
      if (!isSuggestions) return;

      handleFilterChange(column, value);
    },
    [isSuggestions, handleFilterChange]
  );

  /**
   * フォーカスが外れたときはサジェストを表示しない
   * @param column TableColumn
   */
  const handleSuggestionBlur = useCallback(
    (column: TableColumn) => {
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
    },
    [isSuggestions, setSuggestions]
  );

  /**
   * テーブル内をスクロールするときはサジェストを消す
   *
   * @param column TableColumn
   */
  const handleScrollTable = useCallback(() => {
    if (!isSuggestions) return;
    //console.log('call handleScrollTable');
    const column = columns.find((c) => c.showSuggestions);
    if (!column) return;

    setSuggestions(column, false, 0);
  }, [isSuggestions, columns, setSuggestions]);

  /**
   * サジェスト対象を十字キーで選択できるようにする
   *
   * @param e イベント
   * @param column TableColumn
   * @param filteredSuggestions サジェスト対象
   * @returns
   */
  const handleSuggestionKeyDown = useCallback(
    (
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
    },
    [isSuggestions, setSuggestions]
  );

  // 行をフィルター
  const filterdRows = useMemo(
    () =>
      filterRows(
        pRows,
        columns,
        normalizeBeforeFilter,
        caseSensitiveBeforeFilter,
        separateHiraganaKatakanaBeforeFilter,
        isFilter
      ),
    [
      pRows,
      columns,
      normalizeBeforeFilter,
      caseSensitiveBeforeFilter,
      separateHiraganaKatakanaBeforeFilter,
      isFilter,
    ]
  );

  // 行をソート
  const filteredAndSortedRows = useMemo(
    () => sortRows(filterdRows, sortColumn, sortDirection, isSort),
    [filterdRows, sortColumn, sortDirection, isSort]
  );

  // サジェストの作成
  const filteredSuggestions = useMemo(
    () =>
      filterSuggestions(
        filteredAndSortedRows,
        columns,
        isSuggestions,
        maxSuggestions
      ),
    [filteredAndSortedRows, columns, isSuggestions, maxSuggestions]
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredAndSortedRows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHight,
    overscan: 10,
  });

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
    handleScrollTable,
    filteredAndSortedRows,
    filteredSuggestions,
    rowVirtualizer,
  };
};
