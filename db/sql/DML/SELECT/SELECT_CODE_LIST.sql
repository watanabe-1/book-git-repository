-- コードリスト(コード定義テーブル(ヘッダー))
SELECT 
  SERIAL_KEY -- シリアルキー
  , LIST_NAME -- リストネーム
  , DESCRIPTION -- 説明
  , EDITABLE -- 編集可否(編集可否 1 = 可能 それ以外 = 不可)
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  CODE_LIST;

