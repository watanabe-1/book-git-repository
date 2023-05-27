rem @echo off
rem SetLocal EnableDelayedExpansion

rem カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

cd ../../study/

rem  spring boot の起動

rem 文字コードをUTF-8に変更
chcp 65001
gradlew bootRun
