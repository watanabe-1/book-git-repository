rem @echo off
SetLocal EnableDelayedExpansion

REM �J�����g�f�B���N�g�����A���ݎ��s���Ă���t�@�C���̂���t�H���_�ւƈړ�������
cd /d %~dp0

REM ���ʏ����A���ʕϐ��̌Ăяo��
CALL common.bat

REM �o�͂���e�L�X�g�����`(ERR_���t����.txt)
set textName=npm_install_!date2!!time2!.log

echo npm install �������J�n���܂� > !logPath!\!textName!
REM /y���ƈړ���ɓ����t�@�C�����������ꍇ�㏑��(��{�I�Ƀt�@�C�����͂��Ԃ�Ȃ��̂��O��)

rem package.json�̓��e�ɂ��������ăC���X�g�[��
call npm_install_cmd.bat >> !logPath!\!textName! 2>&1

echo npm install �������I�����܂� >> !logPath!\!textName! 2>&1

pause
