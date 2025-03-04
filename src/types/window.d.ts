interface Window {
  electron: {
    clipboard: {
      readText: () => string;
      writeText: (text: string) => void;
    }
  };
  clipboardAPI: {
    onClipboardContent: (callback: (content: string) => void) => void;
  };
  testAPI?: {
    sendTest: () => void;
  };
  test?: {
    hello: () => string;
  };
  electronAPI?: {
    getClipboardText: () => string;
    onClipboardUpdate: (callback: (text: string) => void) => void;
  };
} 