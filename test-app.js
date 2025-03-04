const { app, BrowserWindow, globalShortcut } = require('electron');

app.whenReady().then(() => {
  console.log('App ready');
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  win.loadURL('data:text/html,<h1>Test App</h1><div id="output">Press Cmd+Shift+T</div>');
  win.webContents.openDevTools();
  
  const registered = globalShortcut.register('CommandOrControl+Shift+T', () => {
    console.log('Shortcut pressed!');
    win.webContents.executeJavaScript(`
      document.getElementById('output').textContent = 'Shortcut works! ' + new Date().toISOString();
    `);
  });
  
  console.log('Shortcut registered:', registered);
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 