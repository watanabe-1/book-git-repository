rem @echo off
rem SetLocal EnableDelayedExpansion

rem �J�����g�f�B���N�g�����A���ݎ��s���Ă���t�@�C���̂���t�H���_�ւƈړ�������
cd /d %~dp0

cd ../../study/

rem  spring boot �̋N��

rem �����R�[�h��UTF-8�ɕύX
chcp 65001
gradlew bootRun
