import React from 'react';
import { addContextPath, pathJoin } from '../../study/util/studyUtil';
import FileBoxOnValidate from './FileBoxOnValidate';

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
  isAddContextPath = true,
  onChange,
}: {
  title?: string;
  name: string;
  error: any;
  accept: string;
  path: string;
  fileName?: string;
  isAddContextPath?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const newPath = fileName ? pathJoin(path, fileName) : path;

  return (
    <>
      <img
        src={isAddContextPath ? addContextPath(newPath) : newPath}
        className="mh-100 mw-100"
        width="50"
        height="30"
      ></img>
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
