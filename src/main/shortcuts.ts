import { clipboard, BrowserWindow, globalShortcut, app } from 'electron';
import { generateTextFromClipboard } from './ai-service';

export function registerShortcuts(mainWindow: BrowserWindow | null): void {
  if (!mainWindow) {
    console.error('No main window available for shortcuts');
    return;
  }

  // Register global shortcut for Cmd+Shift+T
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow) {
      // Toggle window visibility
      if (mainWindow.isVisible()) {
        // If window is already visible, just focus it
        if (!mainWindow.isFocused()) {
          mainWindow.focus();
        }
      } else {
        // Show the window if it's hidden
        mainWindow.show();
        mainWindow.focus();
      }

      // Read clipboard and send to renderer
      const clipboardContent = clipboard.readText();
      try {
        // Send raw clipboard content to renderer
        mainWindow.webContents.send('clipboard-update', clipboardContent);

        // Generate AI response from clipboard content
        if (clipboardContent.trim()) {
          generateTextFromClipboard(clipboardContent, mainWindow);
        }
      } catch (error) {
        console.error('Error processing clipboard content:', error);
      }
    }
  });

  // Register Escape to hide the window
  globalShortcut.register('Escape', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
    }
  });

  // Clean up shortcuts when app is about to quit
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
} 