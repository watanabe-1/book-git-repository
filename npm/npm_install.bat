rem @echo off
SetLocal EnableDelayedExpansion

REM カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

REM 共通処理、共通変数の呼び出し
CALL common.bat

REM 出力するテキスト名を定義(ERR_日付時刻.txt)
set textName=npm_install_!date2!!time2!.log

echo npm install 処理を開始します > !logPath!\!textName!
REM /yだと移動先に同名ファイルがあった場合上書き(基本的にファイル名はかぶらないのが前提)

rem package.jsonの内容にしたがってインストール
call npm_install_cmd.bat >> !logPath!\!textName! 2>&1

echo npm install 処理を終了します >> !logPath!\!textName! 2>&1

pause
