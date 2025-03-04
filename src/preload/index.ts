import { contextBridge, clipboard, ipcRenderer } from 'electron';

// Add more logging
console.log('Preload script running');

// Define the shape of our API
interface ClipboardAPI {
  onClipboardContent: (callback: (content: string) => void) => void;
}

// Expose the clipboard API to the renderer process
contextBridge.exposeInMainWorld('clipboardAPI', {
  onClipboardContent: (callback: (content: string) => void) => {
    console.log('Registering clipboard content listener');
    ipcRenderer.on('clipboard-content', (_event, content) => {
      console.log('Received clipboard content:', content);
      callback(content);
    });
  }
} as ClipboardAPI);

// Expose the electron API for clipboard operations
contextBridge.exposeInMainWorld('electron', {
  clipboard: {
    readText: () => {
      console.log('Reading clipboard text');
      const text = clipboard.readText();
      console.log('Clipboard text:', text);
      return text;
    },
    writeText: (text: string) => clipboard.writeText(text)
  }
});

// Add this at the end of your file
ipcRenderer.on('test-ipc', (_event, message) => {
  console.log('IPC test received:', message);
  const element = document.getElementById('clipboard-content');
  if (element) {
    element.textContent = 'IPC TEST: ' + message;
  }
});

// Expose a test function
contextBridge.exposeInMainWorld('testAPI', {
  sendTest: () => ipcRenderer.send('test-from-renderer', 'Hello from renderer')
}); 