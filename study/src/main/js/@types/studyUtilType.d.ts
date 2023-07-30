/**
 * 祝日一覧用
 */
export type Syukujits = {
  dateFormat: string;
  date: string;
  name: string;
};

/**
 * 画像パス
 */
export type Image = {
  serialKey: string;
  imgId: string;
  imgType: string;
  imgPath: string;
  imgName: string;
  note: string;
  insDate: Date;
  insUser: string;
  updDate: Date;
  updUser: string;
  catIcon: File;
  imgIds: Image;
};

/**
 * カテゴリー
 */
export type Category = {
  serialKey: string;
  catCode: string;
  catName: string;
  catType: string;
  note: string;
  imgType: string;
  imgId: string;
  active: string;
  insDate: Date;
  insUser: string;
  updDate: Date;
  updUser: string;
  catIcon: File;
  imgIds: Image;
  delete: string;
};

/**
 * カテゴリーリスト
 */
export type CategoryFormList = {
  catDataList: Category[];
};

/**
 * デフォルトカテゴリー
 */
export type DefaultCategory = {
  booksType: string;
  booksPlace: string;
  catCode: string;
  booksMethod: string;
  booksAmmount: number;
};

/**
 * デフォルトカテゴリーリスト
 */
export type DefaultCategoryFormList = {
  defCatDataList: DefaultCategory[];
};

/**
 * 家計簿
 */
export type Books = {
  serialKey: string;
  booksId: string;
  userId: string;
  booksType: string;
  booksDate: string;
  booksDateFormat: string;
  booksPlace: string;
  catCode: string;
  booksMethod: string;
  booksAmmount: number;
  insDate: Date;
  insUser: string;
  updDate: Date;
  updUser: string;
  catCodes: Category;
  booksFile: File;
};

/**
 * タイプ
 */
export type Type = {
  code: string;
  name: string;
};

/**
 * フラグ
 */
export type Flag = {
  value: string;
  name: string;
};

/**
 * 画面共通情報
 */
export type CommonUi = {
  dateFormat: string;
};

/**
 * カテゴリーUI
 */
export type CategoryUi = {
  form: Category;
  imgTypes: Type[];
  catTypes: Type[];
  active: Flag;
  delete: Flag;
};

/**
 * デフォルトカテゴリーUI
 */
export type DefaultCategoryUi = {
  delete: Flag;
  booksTypes: Type[];
  categories: Type[];
};

/**
 * 家計簿UI
 */
export type BooksUi = {
  form: Books;
  booksTypes: Type[];
  booksYears: string[];
};

/**
 * 家計簿変換UI
 */
export type BooksConvertUi = {
  fileTypes: Type[];
};

/**
 * 家計簿確認用データ
 */
export type HouseholdUi = {
  expensesList: Books[];
  incomeList: Books[];
  year: string;
  month: string;
  day: string;
  tab: string;
};

/**
 * エラー
 */
export type ErrorResult = {
  code: string;
  message: string;
  itemPath: string;
  isError: boolean;
};

/**
 * エラー
 */
export type ErrorResults = {
  errorResults: ErrorResult[];
};

/**
 * form入力確認画面表示リスト用データ保持
 */
export type FormConfirmData = {
  id: string;
  name: string;
  value: string | File;
  type: string;
};

/**
 * ListTableForm作成時使用object作成メソッドで使用するconfigのタイプ
 */
export type BuildListTableFormObjConfig = {
  className: string;
  primaryKey: string | string[];
  list: {
    name: string;
    table: {
      head: string;
      getCell: (props: FormikProps<?>, names: unknown) => JSX.Element;
      hidden: boolean;
    };
    addition: {
      yup: RequiredStringSchema<string, AnyObject>;
    };
  }[];
};

/**
 * ListTableForm作成時使用object作成メソッドで作成obj
 */
export type TableFormObjConfig = {
  additions: Record<string, Reference<unknown>>;
  initialValues: unknown;
  rowName: config.className;
  getRows: (props: FormikProps<unknown>) => TableRow[];
  columns: TableColumn[];
};

/**
 * tableカラム用
 */
export type TableColumn = {
  name: string;
  value: string;
  filterValue: string;
  hidden: boolean;
};

/**
 * tableセル用
 */
export type TableCell = {
  name: string;
  value: string;
  element: JSX.Element;
  hidden: boolean;
};

/**
 * table行用
 */
export type TableRow = {
  primaryKey: string;
  cells: TableCell[];
};
