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

  // AI generation events
  onGenerationStarted: (callback: () => void) => {
    ipcRenderer.on('generation-started', () => {
      callback();
    });
  },

  onGenerationChunk: (callback: (chunk: string) => void) => {
    ipcRenderer.on('generation-chunk', (_event, chunk) => {
      callback(chunk);
    });
  },

  onGenerationCompleted: (callback: () => void) => {
    ipcRenderer.on('generation-completed', () => {
      callback();
    });
  },

  onGenerationError: (callback: (error: string) => void) => {
    ipcRenderer.on('generation-error', (_event, error) => {
      callback(error);
    });
  },

  onApiKeyRequired: (callback: () => void) => {
    ipcRenderer.on('api-key-required', () => {
      callback();
    });
  },

  openApiKeySettings: () => {
    ipcRenderer.send('open-api-key-settings');
  },

  dragWindow: () => {
    ipcRenderer.send('drag-window');
  }
}); 