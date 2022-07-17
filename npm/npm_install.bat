rem @echo off
SetLocal EnableDelayedExpansion

REM カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

rem package.jsonの内容にしたがってインストール
npm install
