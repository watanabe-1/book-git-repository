import React, { useEffect, useState } from 'react';
import BodysLodingSpinner from './BodysLodingSpinner';
import { getNoImagePath } from '../../study/util/studyUtil';

/**
 *
 * @returns 画像アイコン
 */
const ImageIcon = ({
  width = '50',
  height = '30',
  file = null,
  path,
  hidden = false,
}: {
  width?: string;
  height?: string;
  file?: File;
  path: string;
  hidden?: boolean;
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
      setPreviewImage(path);
    } else {
      setPreviewImage(getNoImagePath());
    }
  }, []);

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
