REM カレントディレクトリを、現在実行しているファイルのあるフォルダへと移動させる
cd /d %~dp0
REM %dp0は現在実行しているファイルのあるフォルダを指す(カレントディレクトリ\log)
set logPath=%~dp0log
REM カレントディレクトリ\log\bk
set logBkPath=%logPath%\bk
REM ../カレントディレクトリ
set hierarchyOneLevelUp=%~dp0
set hierarchyOneLevelUp=%hierarchyOneLevelUp:~0,-2%
for %%A in (%hierarchyOneLevelUp%) do set hierarchyOneLevelUp=%%~dpA
REM カレントディレクトリ\js
set jsPath=%hierarchyOneLevelUp%study\WebContent\js\npm
REM カレントディレクトリ\css
set cssPath=%hierarchyOneLevelUp%study\WebContent\css\npm
REM カレントディレクトリ\node_modules
set nodeModulesPath=%~dp0node_modules

REM ログ出力フォルダがなかったら作成
If not exist %logPath% mkdir %logPath%
REM ログ出力bkフォルダがなかったら作成
If not exist %logBkPath% mkdir %logBkPath%
REM jsフォルダがなかったら作成
If not exist %jsPath% mkdir %jsPath%
REM cssフォルダがなかったら作成
If not exist %cssPath% mkdir %cssPath%

REM /yだと移動先に同名ファイルがあった場合上書き(基本的にファイル名はかぶらないのが前提)
REM .txtファイルと.logファイルをbkフォルダに移動
move /y %logPath%\*.log %logBkPath%
move /y %logPath%\*.txt %logBkPath%

REM 現在時刻の文字列を取得
set date2=%date:~0,4%%date:~5,2%%date:~8,2%
set time2=%time: =0%
set time2=%time2:~0,2%%time:~3,2%%time:~6,2%
REM 出力するテキスト名を定義(ERR_日付時刻.txt)
set textName=copy_node_modules_%date2%%time2%.log

rem pause
