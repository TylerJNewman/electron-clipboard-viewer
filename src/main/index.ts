import { app, BrowserWindow, ipcMain, clipboard, Menu } from 'electron';
import * as path from 'path';
import { registerShortcuts } from './shortcuts';

// Only keep essential logs
console.log('==== ELECTRON APP STARTING ====');

let mainWindow: BrowserWindow | null = null;

/**
 * Create application menu
 */
function createAppMenu(): void {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);
}

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

  // Clean up resources
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// Initialize app
app.whenReady().then(() => {
  createWindow();
  createAppMenu();
  registerShortcuts(mainWindow);
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

// Handle window dragging
ipcMain.on('drag-window', () => {
  if (mainWindow) {
    mainWindow.webContents.send('window-dragging');
    mainWindow.setMovable(true);
  }
});

// Export functions for use in shortcuts.ts
export { createWindow }; 