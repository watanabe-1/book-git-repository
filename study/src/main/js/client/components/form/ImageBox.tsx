import React, { useMemo } from 'react';

import FileBox from './FileBox';
import { pathJoin } from '../../../study/util/studyUtil';
import ImageIcon from '../elements/icon/ImageIcon';

type ImageBoxProps = {
  /** ファイルボックスのタイトル */
  title?: string;
  /** ファイルボックスの名前 */
  name: string;
  /** ファイルボックスの値 */
  value?: File;
  /** 初期値(valueとの比較用) */
  initialValue?: File;
  /** 選択できるデフォルトファイルタイプ */
  accept?: string;
  /** imageパス */
  initialPath?: string;
  /** ファイル名 ここに値をセットするとinitialPathと結合したパスとして扱われる*/
  initialFileName?: string;
  /** ファイルボックスの値が変更されたときのハンドラ関数 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** ファイルボックスからフォーカスが外れた時のハンドラ関数 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** 画像をプレビューとして表示するかどうか */
  showPreview?: boolean;
  /** ファイルボックスを非表示にするかどうか */
  hidden?: boolean;
  /** バリデーションを行うかどうかを示すフラグ */
  validate?: boolean;
  /** バリデーションが実行されたかどうかを示すフラグ */
  touched?: boolean;
  /** エラーメッセージ */
  error?: unknown | null;
  /** formが変更されたかどうか */
  dirty?: boolean;
  /** 通常は文字のみでクリックしたときに入力できるようにする */
  isOnClickEditable?: boolean;
};

/**
 * 表示値用
 *
 */
export const getImageBoxTextValue = () => '画像をアップロード';

/**
 *
 * @returns form内の画像用インプットボックス
 */
const ImageBox: React.FC<ImageBoxProps> = ({
  title = null,
  name,
  value = null,
  initialValue,
  accept = 'image/*',
  initialPath = null,
  initialFileName = null,
  onChange,
  onBlur,
  showPreview = false,
  hidden = false,
  validate = false,
  touched = false,
  error = '',
  dirty = false,
  isOnClickEditable = false,
}) => {
  const path = useMemo(() => {
    if (!initialPath) return null;

    return initialFileName
      ? pathJoin(initialPath, initialFileName)
      : initialPath;
  }, [initialPath, initialFileName]);
  const textValue = useMemo(() => getImageBoxTextValue(), []);

  return (
    <>
      {showPreview && <ImageIcon path={path} file={value} />}
      <FileBox
        title={title}
        name={name}
        accept={accept}
        value={value}
        initialValue={initialValue}
        textValue={textValue}
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

export default ImageBox;
