import React from 'react';

import FileBox from './FileBox';
import ImageIcon from './ImageIcon';
import { addContextPath, pathJoin } from '../../study/util/studyUtil';

type FileBoxAndImgProps = {
  /** テキストボックスのタイトル */
  title?: string;
  /** テキストボックスの名前 */
  name: string;
  /** テキストボックスの値 */
  value?: string | number | string[];
  /** 選択できるデフォルトファイルタイプ */
  accept: string;
  /** imageパス */
  path: string;
  /** ファイル名*/
  fileName?: string;
  /** テキストボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** テキストボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** テキストボックスを非表示にするかどうか */
  hidden?: boolean;
  /** バリデーションを行うかどうかを示すフラグ */
  validate?: boolean;
  /** バリデーションが実行されたかどうかを示すフラグ */
  touched?: unknown;
  /** エラーメッセージ */
  error?: unknown;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
};

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBoxAndImg: React.FC<FileBoxAndImgProps> = ({
  title = null,
  name,
  accept,
  value = null,
  path,
  fileName = '',
  onChange,
  onBlur,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
}) => {
  const newPath = fileName ? pathJoin(path, fileName) : path;

  return (
    <>
      <ImageIcon
        path={path.startsWith('data:') ? newPath : addContextPath(newPath)}
        isAddContextPath={false}
      />
      <FileBox
        title={title}
        name={name}
        accept={accept}
        value={value}
        textValue="ファイルをアップロード"
        onChange={onChange}
        onBlur={onBlur}
        hidden={hidden}
        validate={validate}
        touched={touched}
        error={error}
        dirty={dirty}
        isOnClickEditable={isOnClickEditable}
      />
    </>
  );
};

export default FileBoxAndImg;
