set build_type=Debug
if [%1]==[Release] set build_type=%1

del %~dp0\..\build\*

%~dp0\ninja-msvc.bat %build_type% x64
cmake --build .\build
%~dp0\postbuild.bat
