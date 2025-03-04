interface Window {
  electronAPI?: {
    getClipboardText: () => string;
    onClipboardUpdate: (callback: (text: string) => void) => void;
    dragWindow: () => void;
  };
}