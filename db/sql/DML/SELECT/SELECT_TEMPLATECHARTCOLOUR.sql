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

