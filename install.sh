#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Clipboard Viewer Installation ===${NC}"
echo -e "${YELLOW}This script will install Clipboard Viewer to your Applications folder.${NC}"

# Check if the app is already installed
if [ -d "/Applications/Clipboard Viewer.app" ]; then
  echo -e "${YELLOW}Clipboard Viewer is already installed.${NC}"
  read -p "Do you want to reinstall? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Installation cancelled.${NC}"
    exit 0
  fi
  echo -e "${YELLOW}Removing existing installation...${NC}"
  rm -rf "/Applications/Clipboard Viewer.app"
fi

# Check if the DMG exists
if [ -f "dist/Clipboard Viewer-1.0.0-arm64.dmg" ]; then
  echo "Found DMG installer. Installing..."
  
  # Mount the DMG
  echo "Mounting DMG..."
  hdiutil attach "dist/Clipboard Viewer-1.0.0-arm64.dmg" -nobrowse
  
  # Copy the app to Applications
  echo "Copying to Applications folder..."
  cp -R "/Volumes/Clipboard Viewer 1.0.0-arm64/Clipboard Viewer.app" /Applications/
  
  # Unmount the DMG
  echo "Unmounting DMG..."
  hdiutil detach "/Volumes/Clipboard Viewer 1.0.0-arm64"
  
  echo "Installation complete!"
  echo "You can now run Clipboard Viewer from your Applications folder."
  echo "Note: You may need to right-click the app and select 'Open' the first time you run it."
  
elif [ -f "dist/Clipboard Viewer-1.0.0-arm64-mac.zip" ]; then
  echo "Found ZIP archive. Installing..."
  
  # Create a temporary directory
  temp_dir=$(mktemp -d)
  
  # Unzip the archive
  echo "Extracting ZIP..."
  unzip -q "dist/Clipboard Viewer-1.0.0-arm64-mac.zip" -d "$temp_dir"
  
  # Copy the app to Applications
  echo "Copying to Applications folder..."
  cp -R "$temp_dir/Clipboard Viewer.app" /Applications/
  
  # Clean up
  echo "Cleaning up..."
  rm -rf "$temp_dir"
  
  echo "Installation complete!"
  echo "You can now run Clipboard Viewer from your Applications folder."
  echo "Note: You may need to right-click the app and select 'Open' the first time you run it."
  
else
  echo "Error: Could not find the installer package."
  echo "Please run 'pnpm run dist' first to build the application."
  exit 1
fi

# Prompt for Google API key
echo -e "${YELLOW}Would you like to set up your Google Generative AI API key now?${NC}"
read -p "Enter your API key (or press Enter to skip): " API_KEY

if [ -n "$API_KEY" ]; then
  # Create the user data directory if it doesn't exist
  USER_DATA_DIR="$HOME/Library/Application Support/Clipboard Viewer"
  mkdir -p "$USER_DATA_DIR"
  
  # Create or update the config.json file
  CONFIG_FILE="$USER_DATA_DIR/config.json"
  echo "{\"googleApiKey\": \"$API_KEY\"}" > "$CONFIG_FILE"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}API key saved successfully!${NC}"
  else
    echo -e "${RED}Failed to save API key. You can set it later in the app settings.${NC}"
  fi
else
  echo -e "${YELLOW}No API key provided. You can set it later in the app settings.${NC}"
fi

echo -e "${GREEN}Clipboard Viewer has been installed to your Applications folder.${NC}"
echo -e "${YELLOW}You can now launch it from your Applications folder or Spotlight.${NC}"
echo -e "${YELLOW}Press Cmd+Shift+T to show/hide the app once it's running.${NC}"

exit 0 