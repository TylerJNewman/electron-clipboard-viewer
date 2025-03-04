import { useState, useEffect } from 'react';
import './styles.css';

export function App() {
  const [clipboardContent, setClipboardContent] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Function to handle keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+Shift+T (Mac) or Ctrl+Shift+T (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'T') {
        // Toggle visibility
        setIsVisible(prev => !prev);

        // If becoming visible, get the latest clipboard content
        if (!isVisible) {
          fetchClipboardContent();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const fetchClipboardContent = async () => {
    try {
      // Assuming you have an API or electron method to get clipboard content
      const content = await window.electron.clipboard.readText();
      setClipboardContent(content);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <div className={`app-container ${!isVisible ? 'hidden' : ''}`}>
      <h1>Clipboard Content</h1>
      <div className="clipboard-content">
        {clipboardContent || 'No content in clipboard'}
      </div>
    </div>
  );
}

export default App; 