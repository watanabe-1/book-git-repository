import React from 'react';
import Table from 'react-bootstrap/Table';

import TableBody from './components/TableBody';
import TableHeader from './components/TableHeader';
import { useListTable } from './hooks/useListTable';
import { ListTableProps } from './types/listTableProps';

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
  maxSuggestions = 5,
  normalizeBeforeFilter = true,
  caseSensitiveBeforeFilter = false,
  separateHiraganaKatakanaBeforeFilter = false,
}) => {
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
    filteredAndSortedRows,
    filteredSuggestions,
  } = useListTable({
    columns: pColumns,
    rows: pRows,
    isSort,
    isFilter,
    isSuggestions,
    maxSuggestions,
    normalizeBeforeFilter,
    caseSensitiveBeforeFilter,
    separateHiraganaKatakanaBeforeFilter,
  });

  // console.log('pRows');
  // console.log(pRows);

  return (
    <Table bordered>
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
      <TableBody filteredAndSortedRows={filteredAndSortedRows} />
    </Table>
  );
};

export default ListTable;
