set build_type=Release
if [%1]==[Release] set build_type=%1
set build_dir=%~dp0\..\build

del /Q %build_dir%\*
cd %build_dir%
%~dp0\vs-msvc.bat %build_type% x64
cmake --build . --config %build_type%
%~dp0\postbuild.bat
cd %~dp0\..
