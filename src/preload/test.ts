import { contextBridge, clipboard, ipcRenderer } from 'electron';

console.log('Test preload script running');

// Expose test API
contextBridge.exposeInMainWorld('test', {
  hello: () => 'Hello from preload'
});

// Expose clipboard API
contextBridge.exposeInMainWorld('electronAPI', {
  getClipboardText: () => {
    console.log('Getting clipboard text from preload');
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