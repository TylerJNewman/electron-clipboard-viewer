declare module 'electron-localshortcut' {
  import { BrowserWindow } from 'electron';

  export function register(window: BrowserWindow, accelerator: string, callback: () => void): void;
  export function unregister(window: BrowserWindow, accelerator: string): void;
  export function unregisterAll(window?: BrowserWindow): void;
  export function isRegistered(window: BrowserWindow, accelerator: string): boolean;
} 