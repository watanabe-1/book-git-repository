-- コードルックアップテーブル削除
DROP TABLE IF EXISTS CODELKUP;
-- コードルックアップ(コード定義テーブル(明細))
CREATE TABLE CODELKUP (
  SERIAL_KEY SERIAL NOT NULL UNIQUE, -- シリアルキー
  LIST_NAME VARCHAR(50) NOT NULL, -- リストネーム
  CODE VARCHAR(64) NOT NULL, -- コード
  DESCRIPTION VARCHAR(255) NULL, -- 説明
  SHORT_VALUE VARCHAR(64) NULL, -- 値(短)(コードに対する値(短縮形)を設定)
  LONG_VALUE VARCHAR(255) NULL, -- 値(長)(コードに対する値(全文)を設定)
  EDITABLE VARCHAR(1) NOT NULL DEFAULT '1', -- 編集可否(編集可否 1 = 可能 それ以外 = 不可)
  ACTIVE VARCHAR(100) NOT NULL DEFAULT '1', -- 有効化フラグ(有効化フラグ 1 = 有効 それ以外 = 無効)
  SEQUENCE INTEGER NULL DEFAULT 1000, -- シークエンス(コードリストに対する子コード同士の順番を定義)
  UDF1 VARCHAR(255) NULL, -- 備考(なんでも)1
  UDF2 VARCHAR(255) NULL, -- 備考(なんでも)2
  UDF3 VARCHAR(255) NULL, -- 備考(なんでも)3
  UDF4 VARCHAR(255) NULL, -- 備考(なんでも)4
  UDF5 VARCHAR(255) NULL, -- 備考(なんでも)5
  UDF6 VARCHAR(255) NULL, -- 備考(なんでも)6
  UDF7 VARCHAR(255) NULL, -- 備考(なんでも)7
  NOTE VARCHAR(255) NULL, -- メモ
  INS_DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
  INS_USER VARCHAR(50) NOT NULL DEFAULT CURRENT_USER, -- 登録ユーザー
  UPD_DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
  UPD_USER VARCHAR(50) NOT NULL DEFAULT CURRENT_USER, -- 更新ユーザー
  PRIMARY KEY (LIST_NAME, CODE) -- プライマリーキー
);

