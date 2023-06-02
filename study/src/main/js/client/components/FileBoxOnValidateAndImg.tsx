import { FormikErrors } from 'formik';
import React from 'react';

import { addContextPath, pathJoin } from '../../study/util/studyUtil';
import FileBoxOnValidate from './FileBoxOnValidate';
import ImageIcon from './ImageIcon';

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBoxOnValidateAndImg = ({
  title = null,
  name,
  error,
  accept,
  path,
  fileName = null,
  onChange,
}: {
  title?: string;
  name: string;
  error: FormikErrors<unknown>;
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
      <FileBoxOnValidate
        title={title}
        name={name}
        error={error}
        accept={accept}
        onChange={onChange}
      />
    </>
  );
};

export default FileBoxOnValidateAndImg;
