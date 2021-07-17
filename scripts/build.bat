set build_type=Debug
if [%1]==[Release] set build_type=%1
set build_dir=%~dp0\..\build

del /Q %build_dir%\*
cd %build_dir%
%~dp0\ninja-msvc.bat %build_type% x64
cmake --build .
%~dp0\postbuild.bat
cd %~dp0\..
