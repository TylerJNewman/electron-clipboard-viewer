import { contextBridge, clipboard, ipcRenderer } from 'electron';

// Log when the script runs
console.log('Super simple preload running!');

// Expose a very basic API
contextBridge.exposeInMainWorld('electronAPI', {
  getClipboardText: () => {
    console.log('Getting clipboard text');
    return clipboard.readText();
  },

  onClipboardUpdate: (callback: (text: string) => void) => {
    console.log('Registering clipboard update listener');
    ipcRenderer.on('clipboard-update', (_event, text) => {
      console.log('Received clipboard update:', text);
      callback(text);
    });
  }
}); 