import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import { TableColumn } from '../../../../../../@types/studyUtilType';
import TextBoxExclusionForm from '../../../../form/TextBoxExclusionForm';

import '../../../../../../../css/view/table/autocomplete.css';

type FilterBoxProps = {
  /** カラム */
  column: TableColumn;
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

const FilterBox: React.FC<FilterBoxProps> = ({
  column,
  onFilterChange,
  onSuggestionClick,
  onSuggestionItemClick,
  onSuggestionBlur,
  onSuggestionKeyDown,
  filteredSuggestions,
}) => {
  return (
    <div>
      <TextBoxExclusionForm
        onClick={(e) => {
          e.stopPropagation();
          onSuggestionClick(column);
        }}
        onChange={(e) => onFilterChange(column, e.target.value)}
        value={column.filterValue}
        onBlur={() => {
          onSuggestionBlur(column);
        }}
        onKeyDown={(e) => {
          onSuggestionKeyDown(e, column, filteredSuggestions);
        }}
      />
      {column.showSuggestions && (
        <ListGroup className="suggestionsContainer">
          {filteredSuggestions.map((textValue, index) => {
            return (
              <ListGroup.Item
                key={index}
                // 十字キーで選択されているとき
                variant={index === column.activeSuggestionIndex ? 'dark' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  onSuggestionItemClick(column, textValue);
                  // action=trueが設定されているときにformの中にクリック項目があるとformが送信されてしまうため、ここでeventがこれ以上伝搬することを防ぐ
                  e.preventDefault();
                }}
                action
              >
                {textValue}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};

export default FilterBox;
