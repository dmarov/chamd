cmake_minimum_required(VERSION 3.18.0)
project(chamd VERSION 1.0.0)

file(GLOB modules_src
    "./*.c"
)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/../wdk")
find_package(WDK REQUIRED)
string(REPLACE "/GR" "" CMAKE_CXX_FLAGS ${CMAKE_CXX_FLAGS})
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W1 /WX")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} /W1 /WX")
add_definitions(-DTESTCOMPILE=1)

wdk_add_driver(chamd KMDF 1.15 "dbkdrvr.c" ${modules_src})

target_include_directories(chamd PUBLIC "./src" PUBLIC "${CMAKE_CURRENT_BINARY_DIR}")

set_property(TARGET chamd PROPERTY MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

configure_file(
    "${CMAKE_SOURCE_DIR}/chamd.inf"
    "${CMAKE_CURRENT_BINARY_DIR}"
    COPYONLY
)
