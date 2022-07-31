import './../../common/common';
import * as studyListUtil from './../../study/list/studyListUtil';
//テーブルの内容を並び替えできるようにイベントを追加
//アカウントリスト
studyListUtil.addEventListenerOfSortAndFilterTable('accountListTable', 'AND');
