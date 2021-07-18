:: examples:
:: cd build
:: ..\configure\vs-msvc.bat
:: or
:: ..\configure\vs-msvc.bat Debug
:: or
:: ..\configure\vs-msvc.bat Debug x86
:: or
:: ..\configure\vs-msvc.bat Release

set arch=x64
set build_type=Debug
set vars_arch=amd64
set bit_flag=""
set vcvars=""

if [%1]==[Release] set build_type=%1
if [%2]==[x86] set arch=%2
if [%2]==[x86] set vars_arch=x86_amd64
if [%arch%]==[x86] set bit_flag=-A Win32

set vcvars_community="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvarsall.bat"
set vcvars_enterprise="C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\VC\Auxiliary\Build\vcvarsall.bat"

if exist %vcvars_community% (
    set vcvars=%vcvars_community%
)

if exist %vcvars_enterprise% (
    set vcvars=%vcvars_enterprise%
)

call %vcvars% %vars_arch%
call cmake -G "Visual Studio 16 2019" %bit_flag% "%~dp0/../src"
