#!/usr/bin/env bash
#
# Done (Definitely One) - One-line Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/Definitely-Platform/Desktop_App/main/install.sh | bash
#

set -e

REPO="Definitely-Platform/Desktop_App"
APP_NAME="Done"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

printf "${BOLD}${BLUE}"
cat << "EOF"
  ____                        
 |  _ \  ___  _ __   ___  
 | | | |/ _ \| '_ \ / _ \ 
 | |_| | (_) | | | |  __/ 
 |____/ \___/|_| |_|\___| 
EOF
printf "${NC}\n"
printf "${BOLD}Definitely One — Desktop Installer${NC}\n\n"

# 1. Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

if [ "$OS" != "Darwin" ]; then
  if [[ "$OS" =~ "MINGW" ]] || [[ "$OS" =~ "MSYS" ]] || [[ "$OS" =~ "CYGWIN" ]]; then
    printf "${YELLOW}Detected Windows environment (Bash).${NC}\n"
    printf "For the best Windows experience, run this in PowerShell:\n\n"
    printf "  ${BOLD}irm https://raw.githubusercontent.com/${REPO}/main/install.ps1 | iex${NC}\n\n"
    exit 0
  else
    printf "${RED}Unsupported OS: ${OS}. Currently macOS and Windows are supported.${NC}\n"
    exit 1
  fi
fi

# 2. Detect macOS Architecture
case "$ARCH" in
  arm64|aarch64)
    TARGET_ARCH="aarch64"
    ARCH_NAME="Apple Silicon (M1/M2/M3/M4)"
    ;;
  x86_64)
    TARGET_ARCH="x64"
    ARCH_NAME="Intel (x86_64)"
    ;;
  *)
    printf "${RED}Unsupported architecture: ${ARCH}${NC}\n"
    exit 1
    ;;
esac

printf "${BLUE}==>${NC} Detected macOS: ${BOLD}${ARCH_NAME}${NC}\n"

# 3. Fetch latest release info from GitHub
printf "${BLUE}==>${NC} Finding latest release from GitHub...\n"
LATEST_RELEASE_JSON=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest")
TAG_NAME=$(echo "$LATEST_RELEASE_JSON" | grep -m 1 '"tag_name":' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')

if [ -z "$TAG_NAME" ]; then
  printf "${RED}Failed to determine the latest release tag.${NC}\n"
  exit 1
fi

printf "${BLUE}==>${NC} Latest release: ${GREEN}${BOLD}${TAG_NAME}${NC}\n"

# Find matching DMG URL
DMG_PATTERN="Done_.*_${TARGET_ARCH}\.dmg"
DMG_URL=$(echo "$LATEST_RELEASE_JSON" | grep "browser_download_url" | grep -E "$DMG_PATTERN" | head -n 1 | sed -E 's/.*"browser_download_url": *"([^"]+)".*/\1/')

if [ -z "$DMG_URL" ]; then
  # Fallback to direct latest download URL convention
  DMG_URL="https://github.com/${REPO}/releases/latest/download/Done_${TAG_NAME#v}_${TARGET_ARCH}.dmg"
fi

# 4. Download DMG
TMP_DIR=$(mktemp -d)
DMG_PATH="${TMP_DIR}/Done.dmg"

cleanup() {
  if [ -d "$TMP_MOUNT" ]; then
    hdiutil detach "$TMP_MOUNT" -quiet 2>/dev/null || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

printf "${BLUE}==>${NC} Downloading ${BOLD}${TAG_NAME}${NC}...\n"
curl -fSL --progress-bar "$DMG_URL" -o "$DMG_PATH"

# 5. Mount DMG & Install
TMP_MOUNT="${TMP_DIR}/mount"
mkdir -p "$TMP_MOUNT"

printf "${BLUE}==>${NC} Installing to ${BOLD}/Applications/Done.app${NC}...\n"
hdiutil attach -nobrowse -mountpoint "$TMP_MOUNT" "$DMG_PATH" -quiet

# Remove old installation if exists
if [ -d "/Applications/Done.app" ]; then
  rm -rf "/Applications/Done.app"
fi

# Copy app bundle
cp -R "${TMP_MOUNT}/Done.app" /Applications/

# Detach DMG
hdiutil detach "$TMP_MOUNT" -quiet

# 6. Remove macOS quarantine flag so it opens without Gatekeeper prompts
printf "${BLUE}==>${NC} Setting permissions (bypassing Gatekeeper warning)...\n"
xattr -cr /Applications/Done.app 2>/dev/null || true

printf "\n${GREEN}${BOLD}✓ Done has been installed successfully!${NC}\n"
printf "Located at: ${BOLD}/Applications/Done.app${NC}\n\n"

# 7. Ask to launch
printf "${BLUE}==>${NC} Launching Done...\n"
open /Applications/Done.app
