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
  imgId: string;
  imgType: string;
  imgPath: string;
  imgName: string;
  note: string;
  catIcon: File;
  imgIds: Image;
};

/**
 * カテゴリー
 */
export type Category = {
  catCode: string;
  catName: string;
  catType: string;
  note: string;
  imgType: string;
  imgId: string;
  active: string;
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
  defaultCategoryId: string;
  booksType: string;
  booksPlace: string;
  booksMethod: string;
  booksAmmountMin: number;
  booksAmmountMax: number;
  catCode: string;
  regexEnabled: string;
  delete: string;
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
  booksId: string;
  booksType: string;
  booksDate: string;
  booksDateFormat: string;
  booksPlace: string;
  catCode: string;
  booksMethod: string;
  booksAmmount: number;
  catCodes: Category;
  booksFile: File;
};

/**
 * 家計簿リスト
 */
export type BooksFormList = {
  booksDataList: Books[];
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
  regexEnabled: Flag;
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
  categoryList: Category[];
  year: string;
  month: string;
  day: string;
  tab: string;
  delete: Flag;
  categoryTypes: Type[];
  booksTypeExpenses: string;
  booksTypeIncome: string;
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
    modifier?: (value?: unknown) => unknown;
    table: {
      head: string;
      getCell: (
        props: FormikProps<?>,
        names: unknown
      ) => {
        element: JSX.Element;
        value: unknown;
        textValue: string;
      };
      hidden?: boolean;
    };
    addition?: {
      yup: RequiredStringSchema<string, AnyObject>;
    };
  }[];
};

/**
 * ListTableForm作成時使用object作成メソッドで作成obj
 */
export type TableFormObjConfig = {
  additions: Record<string, Reference<unknown>>;
  initialValues: object;
  rowName: string;
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
  textValue: string;
  element: JSX.Element;
  hidden: boolean;
};

/**
 * table行用
 */
export type TableRow = {
  primaryKey: string;
  cells: TableCell[];
  hidden: boolean;
};
