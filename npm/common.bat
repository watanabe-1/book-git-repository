REM �J�����g�f�B���N�g�����A���ݎ��s���Ă���t�@�C���̂���t�H���_�ւƈړ�������
cd /d %~dp0
REM %dp0�͌��ݎ��s���Ă���t�@�C���̂���t�H���_���w��(�J�����g�f�B���N�g��\log)
set logPath=%~dp0log
REM �J�����g�f�B���N�g��\log\bk
set logBkPath=%logPath%\bk
REM ../�J�����g�f�B���N�g��
set hierarchyOneLevelUp=%~dp0
set hierarchyOneLevelUp=%hierarchyOneLevelUp:~0,-2%
for %%A in (%hierarchyOneLevelUp%) do set hierarchyOneLevelUp=%%~dpA
REM �J�����g�f�B���N�g��\js
set jsPath=%hierarchyOneLevelUp%study\WebContent\js\npm
REM �J�����g�f�B���N�g��\css
set cssPath=%hierarchyOneLevelUp%study\WebContent\css\npm
REM �J�����g�f�B���N�g��\node_modules
set nodeModulesPath=%~dp0node_modules

REM ���O�o�̓t�H���_���Ȃ�������쐬
If not exist %logPath% mkdir %logPath%
REM ���O�o��bk�t�H���_���Ȃ�������쐬
If not exist %logBkPath% mkdir %logBkPath%
REM js�t�H���_���Ȃ�������쐬
If not exist %jsPath% mkdir %jsPath%
REM css�t�H���_���Ȃ�������쐬
If not exist %cssPath% mkdir %cssPath%

REM /y���ƈړ���ɓ����t�@�C�����������ꍇ�㏑��(��{�I�Ƀt�@�C�����͂��Ԃ�Ȃ��̂��O��)
REM .txt�t�@�C����.log�t�@�C����bk�t�H���_�Ɉړ�
move /y %logPath%\*.log %logBkPath%
move /y %logPath%\*.txt %logBkPath%

REM ���ݎ����̕�������擾
set date2=%date:~0,4%%date:~5,2%%date:~8,2%
set time2=%time: =0%
set time2=%time2:~0,2%%time:~3,2%%time:~6,2%
REM �o�͂���e�L�X�g�����`(ERR_���t����.txt)
set textName=copy_node_modules_%date2%%time2%.log

rem pause
