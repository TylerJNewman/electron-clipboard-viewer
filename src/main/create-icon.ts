import * as fs from 'fs';
import * as path from 'path';

// Simple clipboard icon as Base64 PNG
const iconBase64 = `
iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB
hUlEQVR42mNgGAWjYBSMglEwCoYnYPz//z/D////GUF0QAzI4GVlZWXbtWsX258/fxhAGMQGiQP1
MILUsrCwMDCzsrIyBgQEMOzevZvh79+/YAxi//nzB6wGpJaRkZGBmYuLi9Hf359h165dDL9//wZj
EPvXr19gNSD1ILUgPcwgBQEBAQw7d+5k+PHjBxiD2D9//gSrAakHqQXpYQYZ4Ofnx7Bjxw6GHz9+
gDGI/ePHD7AakHqQWpAeZpAL/Pz8GLZv387w/ft3MAaxv337BlYDUg9SC9LDDDLAx8eHYdu2bQzf
vn0DYxD727dvYDUg9SC1ID3MIAd4e3szbN26leHLly9gDGJ/+fIFrAakHqQWpIcZZICXlxfDli1b
GD5//gzGIPbnz5/BakDqQWpBepiZmJgYvby8GDZv3szw6dMnMAaxP336BFYD8j5ILUgPM8gADw8P
hk2bNjF8/PgRjEHsDx8+gNWA1IPUgvQwgwzw8PBg2LBhA8P79+/BGMR+//49WA1IPUgtSA/zKBgF
o2AUjIJRMDwBAOjXZ7/wdxDBAAAAAElFTkSuQmCC
`;

// Create directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', '..', 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Path to save the tray icon
const trayIconPath = path.join(assetsDir, 'tray-icon.png');

// Convert Base64 to binary and save as PNG
const iconData = Buffer.from(iconBase64.trim(), 'base64');
fs.writeFileSync(trayIconPath, iconData);

console.log(`Tray icon created at: ${trayIconPath}`);

// Create a larger app icon for distribution
const appIconPath = path.join(assetsDir, 'app-icon.png');
fs.writeFileSync(appIconPath, iconData); // Using the same icon for now

console.log(`App icon created at: ${appIconPath}`); 