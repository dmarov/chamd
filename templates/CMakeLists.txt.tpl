cmake_minimum_required(VERSION 3.18.0)
project({{DRIVER_NAME}} VERSION 1.0.0)

enable_language(C ASM_MASM)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/../wdk")
find_package(WDK REQUIRED)
string(REPLACE "/GR" "" CMAKE_CXX_FLAGS ${CMAKE_CXX_FLAGS})
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W0 /WX")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} /W0 /WX")
add_definitions( -DRELEASE="DEFINED" )

wdk_add_driver({{DRIVER_NAME}} KMDF 1.15
    "${CMAKE_CURRENT_SOURCE_DIR}/DBKDrvr.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/DBKFunc.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/debugger.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/deepkernel.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/interruptHook.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/IOPLDispatcher.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/memscan.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/noexceptions.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/processlist.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/threads.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/ultimap.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/ultimap2.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/ultimap2/apic.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/vmxhelper.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/vmxoffload.c"

    "${CMAKE_CURRENT_SOURCE_DIR}/amd64/dbkfunca.asm"
    "${CMAKE_CURRENT_SOURCE_DIR}/amd64/debuggera.asm"
    "${CMAKE_CURRENT_SOURCE_DIR}/amd64/noexceptionsa.asm"
    "${CMAKE_CURRENT_SOURCE_DIR}/amd64/ultimapa.asm"
    "${CMAKE_CURRENT_SOURCE_DIR}/amd64/vmxhelpera.asm"
    "${CMAKE_CURRENT_SOURCE_DIR}/amd64/vmxoffloada.asm"
)

target_include_directories({{DRIVER_NAME}} PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}" PUBLIC "${CMAKE_CURRENT_BINARY_DIR}")
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set_target_properties({{DRIVER_NAME}}
    PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY_RELEASE "${CMAKE_BINARY_DIR}"
    RUNTIME_OUTPUT_DIRECTORY_DEBUG "${CMAKE_BINARY_DIR}"
)
