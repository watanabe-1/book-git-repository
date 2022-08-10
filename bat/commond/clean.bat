rem @echo off
rem SetLocal EnableDelayedExpansion

rem カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

cd ../../study/

rem  クリーンの実行
gradlew cleanGen && gradlew clean