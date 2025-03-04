import { contextBridge, clipboard, ipcRenderer } from 'electron';

console.log('Simple preload script running');

// Expose clipboard API directly
contextBridge.exposeInMainWorld('electron', {
  clipboard: {
    readText: () => clipboard.readText(),
    writeText: (text: string) => clipboard.writeText(text)
  }
});

// Expose IPC for main process communication
contextBridge.exposeInMainWorld('clipboardAPI', {
  onClipboardContent: (callback: (content: string) => void) => {
    ipcRenderer.on('clipboard-content', (_event, content) => {
      console.log('Received clipboard content via IPC:', content);
      callback(content);
    });
  }
}); 