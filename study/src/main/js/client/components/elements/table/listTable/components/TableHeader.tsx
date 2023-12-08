import React from 'react';

import FilterBox from './FilterBox';
import { TableColumn } from '../../../../../../@types/studyUtilType';
import { iconConst } from '../../../../../../constant/iconConstant';
import Icon from '../../../icon/Icon';
import { ASCENDING } from '../functions/tableUtils';

type TableHeaderProps = {
  /** 列 */
  columns: TableColumn[];
  /** ヘッダーをクリックしたときにソートを行うか */
  isSort?: boolean;
  /** ヘッダーにフィルター用検索ボックスを設置するか */
  isFilter?: boolean;
  /** ソート対象カラム */
  sortColumn: string | null;
  /** ソート順 */
  sortDirection: string;
  /** ソート実行時のハンドラ関数 */
  onSort: (column: TableColumn) => void;
  /** フィルターボックスの値が変更されたときのハンドラ関数  */
  onFilterChange: (column: TableColumn, value: string) => void;
  /** フィルターボックスがクリックされたときのハンドラ関数 */
  onSuggestionClick: (column: TableColumn) => void;
  /** サジェストがクリックされたときのハンドラ関数  */
  onSuggestionItemClick: (column: TableColumn, value: string) => void;
  /** サジェストから離れたときのハンドラ関数  */
  onSuggestionBlur: (column: TableColumn) => void;
  /** サジェストが出ているときにキー入力したときのハンドラ関数  */
  onSuggestionKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    column: TableColumn,
    filteredSuggestions: string[]
  ) => void;
  /** サジェスト */
  filteredSuggestions: string[];
};

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  isSort,
  isFilter,
  sortColumn,
  sortDirection,
  onSort,
  onFilterChange,
  onSuggestionClick,
  onSuggestionItemClick,
  onSuggestionBlur,
  onSuggestionKeyDown,
  filteredSuggestions,
}) => {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.name}
            onClick={() => onSort(column)}
            style={isSort ? { cursor: 'pointer' } : null}
            hidden={column.hidden}
          >
            {column.value}
            {isSort && sortColumn === column.name && (
              <span>
                {sortDirection === ASCENDING ? (
                  <Icon icon={iconConst.bootstrap.BI_CARET_UP_FILL} />
                ) : (
                  <Icon icon={iconConst.bootstrap.BI_CARET_DOWN_FILL} />
                )}
              </span>
            )}
            {isFilter && (
              <FilterBox
                column={column}
                onFilterChange={onFilterChange}
                onSuggestionBlur={onSuggestionBlur}
                onSuggestionClick={onSuggestionClick}
                onSuggestionItemClick={onSuggestionItemClick}
                onSuggestionKeyDown={onSuggestionKeyDown}
                filteredSuggestions={filteredSuggestions}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
