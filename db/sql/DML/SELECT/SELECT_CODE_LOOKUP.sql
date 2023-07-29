-- コードルックアップ(コード定義テーブル(明細))
SELECT 
  SERIAL_KEY -- シリアルキー
  , LIST_NAME -- リストネーム
  , CODE -- コード
  , DESCRIPTION -- 説明
  , SHORT_VALUE -- 値(短)(コードに対する値(短縮形)を設定)
  , LONG_VALUE -- 値(長)(コードに対する値(全文)を設定)
  , EDITABLE -- 編集可否(編集可否 1 = 可能 それ以外 = 不可)
  , ACTIVE -- 有効化フラグ(有効化フラグ 1 = 有効 それ以外 = 無効)
  , SEQUENCE -- シークエンス(コードリストに対する子コード同士の順番を定義)
  , UDF1 -- 備考(なんでも)1
  , UDF2 -- 備考(なんでも)2
  , UDF3 -- 備考(なんでも)3
  , UDF4 -- 備考(なんでも)4
  , UDF5 -- 備考(なんでも)5
  , UDF6 -- 備考(なんでも)6
  , UDF7 -- 備考(なんでも)7
  , NOTE -- メモ
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  CODE_LOOKUP;

