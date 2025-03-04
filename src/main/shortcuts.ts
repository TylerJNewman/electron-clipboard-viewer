import { clipboard, BrowserWindow, globalShortcut, app } from 'electron';

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
        mainWindow.webContents.send('clipboard-update', clipboardContent);
      } catch (error) {
        console.error('Error sending clipboard content:', error);
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