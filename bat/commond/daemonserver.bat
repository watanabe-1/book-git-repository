rem @echo off
rem SetLocal EnableDelayedExpansion

rem カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

cd ../../study/

rem  js専用サーバの起動
gradlew --no-daemon server
