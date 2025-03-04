import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import * as dotenv from 'dotenv';
import { createYouTubeTranscriptPrompt } from './prompts';

// Load environment variables from .env files
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

/**
 * Try to load API key from various sources
 */
function getApiKey(): string | null {
  // Check environment variable (includes variables loaded by dotenv)
  const envApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (envApiKey) {
    return envApiKey;
  }

  // Then check for a config file in the user's home directory
  try {
    const userDataPath = app.getPath('userData');
    const configPath = path.join(userDataPath, 'config.json');

    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (configData.googleApiKey) {
        return configData.googleApiKey;
      }
    }
  } catch (error) {
    console.error('Error reading config file:', error);
  }

  return null;
}

/**
 * Generates text using Google's Gemini model based on clipboard content
 * and sends the response back to the renderer
 */
export async function generateTextFromClipboard(
  clipboardContent: string,
  mainWindow: BrowserWindow
): Promise<void> {
  try {
    // Start the generation process
    mainWindow.webContents.send('generation-started');

    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Google Generative AI API key is missing. Please add it to .env.local file:\n' +
        'GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here'
      );
    }

    const stream = await streamText({
      model: google('gemini-2.0-flash-001'),
      prompt: createYouTubeTranscriptPrompt(clipboardContent),
    });

    // Process the stream using the textStream
    for await (const textChunk of stream.textStream) {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('generation-chunk', textChunk);
      }
    }

    // Wait for the stream to complete
    await stream.text;

    // Signal completion
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('generation-completed');
    }
  } catch (error: unknown) {
    console.error('Error generating text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    mainWindow.webContents.send('generation-error', errorMessage);
  }
} 