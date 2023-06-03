/**
 * 祝日一覧用
 */
type Syukujits = {
  date: Date;
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
 * 家計簿
 */
export type Books = {
  serialKey: string;
  booksId: string;
  userId: string;
  booksType: string;
  booksDate: Date;
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
 * 家計簿UI
 */
export type BooksUi = {
  form: Books;
  booksTypes: Type[];
  booksYears: string[];
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
  getRows: (props: FormikProps<unknown>) => {
    cells: {
      name: string;
      value: string;
      element: JSX.Element;
      hidden: boolean;
    }[];
  }[];
  columns: {
    name: string;
    value: string;
    filterValue: string;
    hidden: boolean;
  }[];
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
  cells: TableCell[];
};
