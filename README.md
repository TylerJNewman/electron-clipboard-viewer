# Clipboard Viewer with AI Analysis

A sleek, minimal clipboard viewer inspired by Raycast that includes AI analysis of clipboard content using Google's Gemini model.

## Features

- Global shortcut (Cmd+Shift+T) to view clipboard content
- AI-powered analysis of clipboard content using Google's Gemini model
- Elegant, minimal UI
- Escape key to hide the window

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. **Set up your Google Generative AI API key:**
   
   **Option 1: Environment Variable**
   - Get an API key from [Google AI Studio](https://makersuite.google.com/)
   - Set the environment variable before running the app:
     ```bash
     # For macOS/Linux
     export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
     
     # For Windows (Command Prompt)
     set GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
     
     # For Windows (PowerShell)
     $env:GOOGLE_GENERATIVE_AI_API_KEY="your_api_key_here"
     ```
   
   **Option 2: .env.local File (recommended for development)**
   - Create a `.env.local` file in the application root directory
   - Add the following content to the file:
     ```
     GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
     ```
   - The application will automatically load this file at startup using dotenv
   
   **Option 3: Config File**
   - Create a `config.json` file in the application data directory
   - Add the following content to the file:
     ```json
     {
       "googleApiKey": "your_api_key_here"
     }
     ```

4. Build and run the application:
   ```
   npm run build && npm start
   ```

## Development

- `npm run dev` - Run in development mode
- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run watch` - Watch for changes and restart
- `npm run dist` - Build distributable packages

## How It Works

1. Press Cmd+Shift+T to view your clipboard content
2. The application will automatically analyze the clipboard content using Google's Gemini AI model
3. View both the original clipboard content and the AI analysis
4. Press Escape to hide the window

## Technologies Used

- Electron
- TypeScript
- Google Generative AI (Gemini)
- AI SDK
- dotenv (for environment variable management)

## Usage

- Press `⌘+⇧+T` (macOS) or `Ctrl+Shift+T` (Windows/Linux) to show/hide the clipboard viewer
- Press `Escape` to hide the window
- Click the tray icon to show the window
- Right-click the tray icon for more options
- The clipboard content is automatically updated when you copy new text

## License

MIT
