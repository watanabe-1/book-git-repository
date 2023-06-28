import React from 'react';

import { addContextPath, pathJoin } from '../../study/util/studyUtil';
import FileBox from './FileBox';
import ImageIcon from './ImageIcon';

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBoxAndImg = ({
  title = null,
  name,
  validate = false,
  error,
  accept,
  path,
  fileName = null,
  onChange,
}: {
  title?: string;
  name: string;
  validate?: boolean;
  error: unknown;
  accept: string;
  path: string;
  fileName?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
        validate={validate}
        error={error}
        accept={accept}
        onChange={onChange}
      />
    </>
  );
};

export default FileBoxAndImg;
