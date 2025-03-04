import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

// Ensure build directory exists
const buildDir = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create a simple SVG icon
const svgIcon = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#333333" rx="200" ry="200"/>
  <rect x="200" y="300" width="624" height="424" fill="#FF6363" rx="50" ry="50"/>
  <rect x="250" y="350" width="524" height="324" fill="#FFFFFF" rx="20" ry="20"/>
  <rect x="300" y="400" width="424" height="50" fill="#333333" rx="10" ry="10"/>
  <rect x="300" y="480" width="424" height="50" fill="#333333" rx="10" ry="10"/>
  <rect x="300" y="560" width="300" height="50" fill="#333333" rx="10" ry="10"/>
</svg>
`;

// Write SVG file
const svgPath = path.join(buildDir, 'icon.svg');
fs.writeFileSync(svgPath, svgIcon);

console.log('SVG icon created at', svgPath);

// For macOS, we need to convert to .icns format
// This requires additional tools like 'iconutil' which is available on macOS
if (process.platform === 'darwin') {
  // First convert SVG to PNG using a command-line tool like 'convert' from ImageMagick
  // Note: You need to have ImageMagick installed for this to work
  console.log('Converting SVG to PNG...');

  // Create iconset directory
  const iconsetDir = path.join(buildDir, 'icon.iconset');
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir, { recursive: true });
  }

  // Define the sizes needed for macOS icons
  const sizes = [16, 32, 64, 128, 256, 512, 1024];

  // Use ImageMagick's convert to create PNGs of different sizes
  // Note: This is a simplified example. In a real app, you might want to use a Node.js
  // library for image processing instead of relying on external commands.
  console.log('Please install ImageMagick if not already installed:');
  console.log('brew install imagemagick');

  console.log('\nThen run the following commands manually to create the icon:');

  sizes.forEach(size => {
    const doubleSize = size * 2;
    console.log(`convert -background none -resize ${size}x${size} ${svgPath} ${path.join(iconsetDir, `icon_${size}x${size}.png`)}`);
    console.log(`convert -background none -resize ${doubleSize}x${doubleSize} ${svgPath} ${path.join(iconsetDir, `icon_${size}x${size}@2x.png`)}`);
  });

  console.log(`\nThen run: iconutil -c icns ${iconsetDir} -o ${path.join(buildDir, 'icon.icns')}`);

  console.log('\nAlternatively, you can use a tool like Image2Icon or Icon Composer to create the .icns file.');
}

console.log('\nIcon creation script completed.'); 