import { app, BrowserWindow, screen, ipcMain, clipboard, Tray, Menu, nativeImage } from 'electron';
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
let tray: Tray | null = null;

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

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
    // Don't show the window initially, wait for shortcut
    // mainWindow?.show();
    // mainWindow?.focus();
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

  // Create tray icon
  // Comment out the tray icon creation for now
  // const icon = nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'tray-icon.png'));
  // tray = new Tray(icon);
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

// Clean up tray when app is quitting
app.on('will-quit', () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

// Export functions for use in shortcuts.ts
export { createWindow };

// Add this to your main.ts file
ipcMain.on('drag-window', () => {
  if (mainWindow) {
    mainWindow.webContents.send('window-dragging');
    mainWindow.setMovable(true); // Ensure the window is movable
  }
}); 