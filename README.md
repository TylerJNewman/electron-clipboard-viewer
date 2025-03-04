# Clipboard Viewer

A sleek, minimal clipboard viewer inspired by Raycast that uses AI to process clipboard content.

## Features

- Global shortcut (Cmd+Shift+T) to show/hide the app
- AI-powered clipboard content processing using Google's Gemini model
- Elegant, minimal UI with Markdown support
- Escape key to hide the window

## Installation

### From DMG

1. Download the latest `Clipboard Viewer-x.x.x-arm64.dmg` from the releases
2. Mount the DMG by double-clicking it
3. Drag the app to your Applications folder
4. Eject the DMG

### From ZIP

1. Download the latest `Clipboard Viewer-x.x.x-arm64-mac.zip` from the releases
2. Extract the ZIP file
3. Move the extracted app to your Applications folder

## First Run

When running the app for the first time, you might see a security warning since the app is not signed with an Apple Developer certificate. To bypass this:

1. Right-click (or Control+click) on the app in Finder
2. Select "Open" from the context menu
3. Click "Open" in the dialog that appears

## Usage

1. Copy any text to your clipboard
2. Press `Cmd+Shift+T` to show the app and process the clipboard content
3. The app will use AI to analyze and process the clipboard content
4. Press `Escape` to hide the window

## API Key Setup

The app requires a Google Generative AI API key to function. You have three ways to set this up:

### 1. Using the Settings Menu (Recommended)

1. Open the app
2. Click on "File" in the menu bar
3. Select "Settings"
4. Enter your Google Generative AI API key in the dialog
5. Click "Save"

### 2. Using a .env.local File (Development)

Create a `.env.local` file in the app directory with:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 3. Using a config.json File (Advanced)

Create a `config.json` file in the app's user data directory:
```json
{
  "googleApiKey": "your_api_key_here"
}
```

The user data directory is located at:
- macOS: `~/Library/Application Support/Clipboard Viewer/`
- Windows: `%APPDATA%\Clipboard Viewer\`
- Linux: `~/.config/Clipboard Viewer/`

## Getting a Google Generative AI API Key

1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and use it in one of the methods described above

## Development

### Prerequisites

- Node.js 16+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Create app icon
pnpm run create-icon

# Start development mode
pnpm run dev

# Build the app
pnpm run dist
```

## License

MIT
