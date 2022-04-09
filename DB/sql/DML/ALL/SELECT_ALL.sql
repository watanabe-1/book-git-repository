-- カテゴリー(カテゴリー定義テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , CAT_CODE -- カテゴリーコード
  , CAT_NAME -- カテゴリー名
  , CAT_TYPE -- タイプ(ラジオボタン用ー　用途はとりあえず決まってないけど何か別のカテゴリーを設定したくなった時用)
  , NOTE -- メモ
  , IMG_TYPE -- 画像タイプ(画像テーブル内のタイプと連動)
  , IMG_ID -- 画像ID
  , ACTIVE -- 有効化フラグ(有効化フラグ 1 = 有効 それ以外 = 無効)
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  CATEGORY;

-- 画像パス(画像パス保存テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , IMG_ID -- 画像ID
  , IMG_TYPE -- 画像のタイプ
  , IMG_PATH -- 画像名
  , IMG_NAME -- パス(相対/基本的にimagesフォルダ配下想定)
  , NOTE -- メモ
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  IMAGE;

-- 家計簿(家計簿データ保存テーブル)
SELECT 
  SERIAL_KEY -- シリアルキー
  , BOOKS_ID -- 家計簿ID
  , BOOKS_TYPE -- 帳簿の種類(収入、支出を選ぶ)
  , BOOKS_DATE -- 日付(収入日、購入日)
  , BOOKS_PLACE -- 場所(収入元、購入先)
  , CAT_CODE -- カテゴリーコード
  , BOOKS_METHOD -- 方法(受け取り方、支払い方)
  , BOOKS_AMMOUNT -- 金額
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  BOOKS;

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
  CODELIST;

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
  CODELKUP;

-- チャートカラーマスタ(図の表示に使用するrgbaの組み合わせを管理するマスタ)
SELECT 
  SERIAL_KEY -- シリアルキー
  , TEMPLATE_ID -- 色の組み合わせID
  , TEMPLATE_NAME -- 色の組み合わせ名
  , USER_ID -- ユーザーID
  , ACTIVE -- 有効化フラグ(現在設定されている 1 = 有効 それ以外 = 無効)
  , SEED_COEFF_R -- シード値算出に使用する係数(R)(この係数を用いてシード値を算出しRGBAのRの値を算出する)
  , SEED_COEFF_G -- シード値算出に使用する係数(G)(この係数を用いてシード値を算出しRGBAのGの値を算出する)
  , SEED_COEFF_B -- シード値算出に使用する係数(B)(この係数を用いてシード値を算出しRGBAのBの値を算出する)
  , NOTE -- メモ
  , INS_DATE -- 登録日時
  , INS_USER -- 登録ユーザー
  , UPD_DATE -- 更新日時
  , UPD_USER -- 更新ユーザー
FROM
  TEMPLATECHARTCOLOUR;

