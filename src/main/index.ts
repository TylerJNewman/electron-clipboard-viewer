import { app, BrowserWindow, screen, ipcMain, clipboard } from 'electron';
import * as path from 'path';
import { registerShortcuts } from './shortcuts';

console.log('==== ELECTRON APP STARTING ====');
console.log('Process arguments:', process.argv);
console.log('Current directory:', process.cwd());

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Create a window that's centered with a fixed size
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    center: true,
    frame: false,
    transparent: true,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'final.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the final HTML file
  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'final.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready, waiting for shortcut to show');
  });

  // Clean up resources
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Add this line after creating the window
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Add this after creating the window
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window loaded');

    // Send clipboard content
    try {
      const clipboardContent = clipboard.readText();
      console.log('Initial clipboard content:', clipboardContent);
      mainWindow?.webContents.send('clipboard-update', clipboardContent);
    } catch (error) {
      console.error('Error sending clipboard content:', error);
    }
  });

  // Listen for renderer messages
  ipcMain.on('test-from-renderer', (event, arg) => {
    console.log('Received from renderer:', arg);
  });
}

// Initialize app
app.whenReady().then(() => {
  console.log('==== ELECTRON APP READY ====');
  createWindow();
  console.log('Window created');
  registerShortcuts(mainWindow);
  console.log('Shortcuts registered');
});

// Handle macOS behavior
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Add this to your main.ts file
ipcMain.on('drag-window', () => {
  if (mainWindow) {
    mainWindow.webContents.send('window-dragging');
    mainWindow.setMovable(true); // Ensure the window is movable
  }
});

// Export functions for use in shortcuts.ts
export { createWindow }; 