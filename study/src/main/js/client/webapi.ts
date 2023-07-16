import setTimeout from 'setTimeout';
import { TextEncoder } from 'text-encoding-polyfill';

//webapiとして使用できない場合(主にサーバーで実行するときなどに読み取り使用する予定)
const anyWindow = window;

//TextEncoderが用意されていなかったら設定
if (!anyWindow.TextEncoder) {
  anyWindow.TextEncoder = TextEncoder;
}

//setTimeoutが用意されていなかったら設定;
if (!anyWindow.setTimeout) {
  anyWindow.setTimeout = setTimeout;
}
