import React, { useRef } from 'react';
import Table from 'react-bootstrap/Table';

import TableBody from './components/TableBody';
import TableHeader from './components/TableHeader';
import { useListTable } from './hooks/useListTable';
import { ListTableProps } from './types/listTableProps';
import { useWindowSize } from '../../../../hooks/useCommon';

/**
 * ソート、フィルター可能なテーブル
 * @returns テーブル
 */
const ListTable: React.FC<ListTableProps> = ({
  columns: pColumns,
  rows: pRows,
  isSort = true,
  isFilter = true,
  isSuggestions = true,
  isVirtualScroll = true,
  maxSuggestions = 5,
  normalizeBeforeFilter = true,
  caseSensitiveBeforeFilter = false,
  separateHiraganaKatakanaBeforeFilter = false,
  rowHight = 60,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const {
    sortColumn,
    sortDirection,
    columns,
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
  } = useListTable({
    columns: pColumns,
    rows: pRows,
    isSort,
    isFilter,
    isSuggestions,
    isVirtualScroll,
    maxSuggestions,
    normalizeBeforeFilter,
    caseSensitiveBeforeFilter,
    separateHiraganaKatakanaBeforeFilter,
    rowHight,
    tableContainerRef,
  });
  const { height } = useWindowSize();

  // console.log('pRows');
  // console.log(pRows);
  // console.log(height);

  return (
    <div
      ref={tableContainerRef}
      className={isVirtualScroll ? 'overflow-y-auto' : null}
      style={{
        maxHeight: height,
        //height: height,
      }}
      onScroll={handleScrollTable}
    >
      <Table bordered responsive>
        <TableHeader
          onFilterChange={handleFilterChange}
          onSort={handleSort}
          onSuggestionBlur={handleSuggestionBlur}
          onSuggestionClick={handleSuggestionClick}
          onSuggestionItemClick={handleSuggestionItemClick}
          onSuggestionKeyDown={handleSuggestionKeyDown}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          isFilter={isFilter}
          isSort={isSort}
          filteredSuggestions={filteredSuggestions}
        />
        <TableBody
          filteredAndSortedRows={filteredAndSortedRows}
          rowVirtualizer={rowVirtualizer}
          rowHight={rowHight}
        />
      </Table>
    </div>
  );
};

export default ListTable;
