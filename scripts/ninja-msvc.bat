:: examples:
:: cd build
:: ..\configure\ninja-msvc.bat
:: or
:: ..\configure\ninja-msvc.bat Debug
:: or
:: ..\configure\ninja-msvc.bat Debug x86
:: or
:: ..\configure\ninja-msvc.bat Release

set arch=x64
set build_type=Debug
set vars_arch=amd64

if [%1]==[Release] set build_type=%1
if [%2]==[x86] set arch=%2
if [%2]==[x86] set vars_arch=x64_x86

set vcvars_community="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvarsall.bat"
set vcvars_enterprise="C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\VC\Auxiliary\Build\vcvarsall.bat"

if exist %vcvars_community% (
    set vcvars=%vcvars_community%
) else (
    set vcvars=%vcvars_enterprise%
)

set toolchain= "%~dp0/../vcpkg/scripts/buildsystems/vcpkg.cmake"
set triplet="%arch%-windows-static"

call %vcvars% %vars_arch%

cmake -G "Ninja" "../src"^
 "-DCMAKE_TOOLCHAIN_FILE=%toolchain%"^
 "-DVCPKG_TARGET_TRIPLET=%triplet%"^
 "-DCMAKE_EXPORT_COMPILE_COMMANDS=1"^
 "-DCMAKE_BUILD_TYPE=%build_type%"

cp .\compile_commands.json ..\..\..\compile_commands.json
