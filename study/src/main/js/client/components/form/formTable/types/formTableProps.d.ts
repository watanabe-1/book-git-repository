type FormTableProps = {
  /**データ */
  objArray: NestedObject[];
  /** form table用 設定*/
  tableFormConfig: BuildListTableFormObjConfig;
  /** 更新ボタン送信制御用関数 */
  handleFormSubmit: (values: unknown) => Promise<Response>;
  /** 新規ボタン送信制御用関数 */
  handlePushSubmit?: (values: unknown) => Promise<Response>;
  /** submitボタンをhiddenにするかどうか */
  hiddenSubmitButton?: boolean;
  /** 新規ボタンをhiddenにするかどうか */
  hiddenPushButton?: boolean;
  /** enterで送信するかどうか */
  onEnterSubmit?: boolean;
  /** エラーデータ(主にサーバー側を想定) */
  errData?: ErrorResults;
  /** 追加でボタンを設置する場合はここに設定 */
  customeButton?: React.ReactElement | React.ReactElement[];
  /** 修正した行のみ送信対象とする */
  submitModifiedRowsOnly?: boolean;
  /** ヘッダーをクリックしたときにソートを行うか */
  isSort?: boolean;
  /** ヘッダーにフィルター用検索ボックスを設置するか */
  isFilter?: boolean;
};
