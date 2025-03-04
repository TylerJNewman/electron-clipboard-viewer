// Non-JSX version of the App component
export function createApp(container: HTMLElement): void {
  // Create elements
  const appContainer = document.createElement('div');
  appContainer.className = 'app-container';

  const heading = document.createElement('h1');
  heading.textContent = 'Clipboard Content';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'clipboard-content';
  contentDiv.id = 'clipboard-content';
  contentDiv.textContent = 'Press Cmd+Shift+T to view clipboard';

  const button = document.createElement('button');
  button.textContent = 'Read Clipboard';
  button.onclick = () => {
    if (window.electronAPI) {
      const text = window.electronAPI.getClipboardText();
      contentDiv.textContent = text || '(Empty clipboard)';
    } else {
      contentDiv.textContent = 'Clipboard API not available';
    }
  };

  // Assemble the DOM
  appContainer.appendChild(heading);
  appContainer.appendChild(contentDiv);
  appContainer.appendChild(button);

  // Add to container
  container.appendChild(appContainer);

  // Set up clipboard update listener
  if (window.electronAPI) {
    window.electronAPI.onClipboardUpdate((text) => {
      contentDiv.textContent = text || '(Empty clipboard)';
    });
  }
} 