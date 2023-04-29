import { CommonConst } from '../../constant/commonConstant';

/**
 * サーバーで指定しているファイル名を取得
 *
 * @param response レスポンス
 * @returns サーバーで指定しているファイル名
 */
export const getFilenameFromResponse = (response: Response) => {
  const contentDisposition = response.headers.get('content-disposition');
  //console.log(contentDisposition);
  return getFilenameFromContentDisposition(contentDisposition);
};

/**
 * contentDispositionに指定されているファイル名を取得
 * ブラウザの基本動作に法り、filename=とfilename*=が同時に存在した場合は
 * filename*=を優先し、指定の文字コードでデコードする
 * もしかしたら他の文字コードだと正しく動かないかも…
 *
 * @param contentDisposition Content-Disposition
 * @returns ファイル名
 */
export function getFilenameFromContentDisposition(contentDisposition) {
  let filename = null;
  if (contentDisposition) {
    const matches = contentDisposition.match(
      /filename\*=(?:(.*?)['']|%)([^']+)$/i
    );
    if (matches != null && matches.length > 2) {
      const encoding = matches[1]
        ? matches[1].replace("'", '').toUpperCase()
        : CommonConst.StandardCharsets.UTF_8;
      const encodedFilename = matches[2];
      // console.log(encoding);
      // console.log(encodedFilename);

      // 基本的にUTF-8のみ想定のため、必ずdecodeURIComponentで最初にデコードする
      filename = decodeURIComponent(encodedFilename);

      // UTF-8以外の場合は再度デコードを行う
      // デコードが失敗した場合はdecodeURIComponentのデコード結果が採用される想定
      if (encoding != CommonConst.StandardCharsets.UTF_8) {
        try {
          filename = new TextDecoder(encoding).decode(
            new Uint8Array(Buffer.from(encodedFilename, encoding))
          );
        } catch (error) {
          console.warn(
            `Failed to decode filename using ${encoding}: ${error.message}`
          );
        }
      }
    } else {
      const parts = contentDisposition.split(';');
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (part.startsWith('filename=')) {
          filename = part.substring('filename='.length);
          if (filename.startsWith('"') && filename.endsWith('"')) {
            filename = filename.substring(1, filename.length - 1);
          }
          break;
        }
      }
    }
  }
  return filename;
}

/**
 * ファイルのダウンロードを実行する
 *
 * @param blob 対象ファイル
 * @param filename ファイル名
 */
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
