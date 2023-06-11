rem @echo off
rem SetLocal EnableDelayedExpansion

rem カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0

rem カレントディレクトリを一つ下のコマンド階層に移動
cd ./commond

rem spring bootの起動
start bootrun

rem js監視サーバの起動
start daemonwatch