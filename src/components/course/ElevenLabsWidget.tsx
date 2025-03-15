
import { useEffect } from 'react';

/**
 * ElevenLabsWidget - Adds the ElevenLabs conversation widget to the page
 * This component injects the necessary script and custom element for the ElevenLabs Convai widget
 */
const ElevenLabsWidget = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    
    // Create the widget element
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', 'nuHkywywXt4yVZzajEYp');
    
    // Append elements to the body
    document.body.appendChild(widget);
    document.body.appendChild(script);
    
    // Cleanup function to remove the elements when component unmounts
    return () => {
      document.body.removeChild(widget);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ElevenLabsWidget;
