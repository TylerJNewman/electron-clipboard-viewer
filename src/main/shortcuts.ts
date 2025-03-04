import { clipboard, BrowserWindow, globalShortcut, app } from 'electron';

export function registerShortcuts(mainWindow: BrowserWindow | null): void {
  console.log('Setting up keyboard shortcuts');

  if (!mainWindow) {
    console.error('No main window available for shortcuts');
    return;
  }

  // Register global shortcut for Cmd+Shift+T
  const registered = globalShortcut.register('CommandOrControl+Shift+T', () => {
    console.log('Keyboard shortcut detected: Cmd/Ctrl+Shift+T');

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
      console.log('Clipboard content:', clipboardContent);

      try {
        console.log('Sending clipboard content to window ID:', mainWindow.id);
        mainWindow.webContents.send('clipboard-update', clipboardContent);
      } catch (error) {
        console.error('Error sending clipboard content:', error);
      }
    }
  });

  console.log('Global shortcut registered:', registered);

  // Also register Escape to hide the window
  globalShortcut.register('Escape', () => {
    console.log('Escape pressed');
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
    }
  });

  // Clean up shortcuts when app is about to quit
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
} 