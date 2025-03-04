import { contextBridge, clipboard, ipcRenderer } from 'electron';

console.log('Preload script running');

// Expose clipboard API directly
contextBridge.exposeInMainWorld('electron', {
  clipboard: {
    readText: () => {
      console.log('Reading clipboard via preload');
      return clipboard.readText();
    },
    writeText: (text: string) => clipboard.writeText(text)
  }
});

// Expose IPC for main process communication
contextBridge.exposeInMainWorld('clipboardAPI', {
  onClipboardContent: (callback: (content: string) => void) => {
    console.log('Registering clipboard content listener');
    ipcRenderer.on('clipboard-content', (_event, content) => {
      console.log('IPC: Received clipboard content:', content);
      callback(content);
    });
  }
}); 