import { app, BrowserWindow, ipcMain, clipboard, Menu, dialog } from 'electron';
import * as path from 'path';
import { registerShortcuts } from './shortcuts';
import * as fs from 'fs';

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
        {
          label: 'Settings',
          click: () => openSettingsDialog()
        },
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

/**
 * Opens a dialog to configure the Google API key
 */
function openSettingsDialog(): void {
  if (!mainWindow) return;

  const userDataPath = app.getPath('userData');
  const configPath = path.join(userDataPath, 'config.json');

  let currentApiKey = '';

  // Try to read the current API key
  try {
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      currentApiKey = configData.googleApiKey || '';
    }
  } catch (error) {
    console.error('Error reading config file:', error);
  }

  // Prompt the user for the API key using a simple dialog
  const result = dialog.showMessageBoxSync(mainWindow, {
    type: 'question',
    buttons: ['Save', 'Cancel'],
    defaultId: 0,
    title: 'API Key Settings',
    message: 'Enter your Google Generative AI API Key:',
    detail: 'This key will be stored in your application data directory.',
    cancelId: 1,
  });

  // If user clicked Save, show a prompt for the API key
  if (result === 0) {
    // Create a temporary input window
    const inputWindow = new BrowserWindow({
      width: 500,
      height: 150,
      parent: mainWindow,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Create a simple HTML form
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Enter API Key</title>
        <style>
          body { font-family: system-ui; padding: 20px; }
          input { width: 100%; padding: 8px; margin: 10px 0; }
          button { padding: 8px 16px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <form id="apiForm">
          <label for="apiKey">Google Generative AI API Key:</label>
          <input type="text" id="apiKey" value="${currentApiKey}" />
          <div>
            <button type="submit">Save</button>
            <button type="button" id="cancelBtn">Cancel</button>
          </div>
        </form>
        <script>
          const { ipcRenderer } = require('electron');
          document.getElementById('apiForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const apiKey = document.getElementById('apiKey').value;
            ipcRenderer.send('save-api-key', apiKey);
          });
          document.getElementById('cancelBtn').addEventListener('click', () => {
            window.close();
          });
        </script>
      </body>
      </html>
    `;

    // Load the HTML
    inputWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    inputWindow.once('ready-to-show', () => {
      inputWindow.show();
    });

    // Handle the API key submission
    ipcMain.once('save-api-key', (event, apiKey) => {
      if (apiKey) {
        try {
          let configData: Record<string, any> = {};

          if (fs.existsSync(configPath)) {
            configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          }

          configData.googleApiKey = apiKey;

          fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

          // Also set it in the environment
          process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;

          dialog.showMessageBox(mainWindow!, {
            type: 'info',
            buttons: ['OK'],
            title: 'Success',
            message: 'API key saved successfully.'
          });
        } catch (error) {
          console.error('Error saving API key:', error);
          dialog.showErrorBox('Error', 'Failed to save API key.');
        }
      }

      inputWindow.close();
    });
  }
}

// Add a handler for missing API key
ipcMain.on('open-api-key-settings', () => {
  openSettingsDialog();
});

// Export functions for use in shortcuts.ts
export { createWindow }; 