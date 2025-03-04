import { app, BrowserWindow, screen, ipcMain, clipboard } from 'electron';
import * as path from 'path';
import { registerShortcuts } from './shortcuts';

// At the very top of your file
console.log('==== ELECTRON APP STARTING ====');
console.log('Process arguments:', process.argv);
console.log('Current directory:', process.cwd());

// Enable hot reloading in development
if (process.env.NODE_ENV !== 'production') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
    console.log('Hot reloading enabled');
  } catch (err) {
    console.error('Error setting up hot reloading:', err);
  }
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create a window that's centered with a fixed size
  mainWindow = new BrowserWindow({
    width: Math.min(800, width * 0.7),
    height: Math.min(500, height * 0.7),
    center: true,
    frame: false, // Frameless window for a cleaner look
    transparent: true, // Allows for rounded corners
    resizable: false,
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'final.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Check if preload path exists
  const preloadPath = path.join(__dirname, '..', 'preload', 'final.js');
  console.log('Preload path:', preloadPath);
  console.log('Preload exists:', require('fs').existsSync(preloadPath));

  // Load the final HTML file
  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'final.html'));

  // Add this right after loadFile to check if the file exists
  const htmlPath = path.join(__dirname, '..', 'renderer', 'final.html');
  console.log('HTML path:', htmlPath);
  console.log('HTML exists:', require('fs').existsSync(htmlPath));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
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

// Export functions for use in shortcuts.ts
export { createWindow }; 