cmake_minimum_required(VERSION 3.22.1)

# Set the project name
project(AstrovigyaUsers)

# Include React Native CMake utilities
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Create empty directories for missing codegen
set(MISSING_CODEGEN_DIRS
    "${NODE_MODULES_DIR}/@d11/react-native-fast-image/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/@react-native-clipboard/clipboard/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-agora/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-blob-util/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-document-picker/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-gesture-handler/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-pdf/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-permissions/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-share/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-vector-icons/android/build/generated/source/codegen/jni"
    "${NODE_MODULES_DIR}/react-native-webview/android/build/generated/source/codegen/jni"
)

# Create directories if they don't exist
foreach(DIR ${MISSING_CODEGEN_DIRS})
    if(NOT EXISTS ${DIR})
        file(MAKE_DIRECTORY ${DIR})
    endif()
endforeach()

# Add React Native application
add_react_android_app(AstrovigyaUsers
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED YES
)
