import { contextBridge, clipboard, ipcRenderer } from 'electron';

// Expose clipboard API
contextBridge.exposeInMainWorld('electronAPI', {
  getClipboardText: () => {
    return clipboard.readText();
  },

  onClipboardUpdate: (callback: (text: string) => void) => {
    ipcRenderer.on('clipboard-update', (_event, text) => {
      callback(text);
    });
  },

  dragWindow: () => {
    ipcRenderer.send('drag-window');
  }
}); 