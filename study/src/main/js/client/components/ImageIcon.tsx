import React, { useEffect, useState } from 'react';

import BodysLodingSpinner from './BodysLodingSpinner';
import { addContextPath, getNoImagePath } from '../../study/util/studyUtil';

type ImageIconProps = {
  /** 横幅 */
  width?: string;
  /** 高さ */
  height?: string;
  /** 表示する画像ファイル(path)より優先 */
  file?: File;
  /** 表示する画像ファイルパス */
  path: string;
  /** 非表示するかどうか */
  hidden?: boolean;
  /** パスにコンテキストを付与するかどうか */
  isAddContextPath?: boolean;
};

/**
 *
 * @returns 画像アイコン
 */
const ImageIcon: React.FC<ImageIconProps> = ({
  width = '50',
  height = '30',
  file = null,
  path,
  hidden = false,
  isAddContextPath = true,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // file に値がある場合がpathよりも優先して表示
  useEffect(() => {
    if (file) {
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setIsLoading(false);
      };

      reader.readAsDataURL(file);
    } else if (path) {
      setPreviewImage(isAddContextPath ? addContextPath(path) : path);
    } else {
      setPreviewImage(getNoImagePath());
    }
  }, [path, file]);

  return (
    <div>
      {isLoading && <BodysLodingSpinner />}
      {previewImage && (
        <img width={width} height={height} src={previewImage} hidden={hidden} />
      )}
    </div>
  );
};

export default ImageIcon;
