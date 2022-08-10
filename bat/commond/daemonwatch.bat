rem @echo off
rem SetLocal EnableDelayedExpansion

rem カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

cd ../../study/

rem  js 監視サーバー の起動 変更があると自動でトランスパイル
gradlew --no-daemon watch
