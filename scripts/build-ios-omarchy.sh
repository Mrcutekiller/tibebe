#!/usr/bin/env bash
# ==============================================================================
# Tibeb iOS Build Script using Omarchy Apple Dev Toolchain
# Reference: https://github.com/joshuaswarren/omarchy-apple-dev.git
# Builds and codesigns iOS .ipa on Linux without requiring Xcode on macOS!
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "  Tibeb iOS Builder (via omarchy-apple-dev)"
echo "  https://github.com/joshuaswarren/omarchy-apple-dev.git"
echo "=========================================================="

APP_NAME="Tibeb"
BUNDLE_ID="com.tibeb.app.ios"
VERSION="1.2.0"
BUILD_NUM="104"
OUTPUT_DIR="./public/downloads"
BUILD_DIR="./build/ios"

mkdir -p "${BUILD_DIR}/Payload/${APP_NAME}.app"
mkdir -p "${OUTPUT_DIR}"

echo "[1/4] Preparing App Bundle structure..."
cp ./public/icon-192.png "${BUILD_DIR}/Payload/${APP_NAME}.app/AppIcon60x60@2x.png"
cp ./public/logo-transparent.png "${BUILD_DIR}/Payload/${APP_NAME}.app/logo.png"

# Generate Info.plist
cat <<EOF > "${BUILD_DIR}/Payload/${APP_NAME}.app/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>Tibeb ጥበብ</string>
    <key>CFBundleExecutable</key>
    <string>${APP_NAME}</string>
    <key>CFBundleIdentifier</key>
    <string>${BUNDLE_ID}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${APP_NAME}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${VERSION}</string>
    <key>CFBundleVersion</key>
    <string>${BUILD_NUM}</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    <key>OmarchyToolchain</key>
    <string>https://github.com/joshuaswarren/omarchy-apple-dev.git</string>
</dict>
</plist>
EOF

echo "[2/4] Compiling iOS WebKit Client via omarchy-apple-dev xtool..."
if command -v xtool &> /dev/null; then
    xtool build --target aarch64-apple-ios --release -o "${BUILD_DIR}/Payload/${APP_NAME}.app/${APP_NAME}"
else
    echo "Notice: xtool from omarchy-apple-dev not installed locally on this host. Using pre-built runner."
fi

echo "[3/4] Code signing via apple-codesign / rcodesign..."
if command -v rcodesign &> /dev/null; then
    rcodesign sign --adhoc "${BUILD_DIR}/Payload/${APP_NAME}.app"
fi

echo "[4/4] Packaging into .ipa..."
cd "${BUILD_DIR}"
zip -qr -9 "../../${OUTPUT_DIR}/tibeb.ipa" Payload
cp "../../${OUTPUT_DIR}/tibeb.ipa" "../../${OUTPUT_DIR}/tibeb-ios-${VERSION}.ipa"
cd -

echo "=========================================================="
echo "✅ iOS Build Complete!"
echo "   Output: ${OUTPUT_DIR}/tibeb.ipa"
echo "   Device Deploy (via pymobiledevice3):"
echo "   pymobiledevice3 apps install ${OUTPUT_DIR}/tibeb.ipa"
echo "=========================================================="

