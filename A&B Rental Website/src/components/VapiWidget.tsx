import { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vapi-widget': {
        'assistant-id': string;
        'public-key': string;
      };
    }
  }
}

export function VapiWidget() {
  useEffect(() => {
    // Load the Vapi SDK script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js';
    script.async = true;
    script.type = 'text/javascript';
    
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <vapi-widget
      assistant-id="0486aeb2-4b6e-4c19-8d9e-8105d7b81479"
      public-key="be59a1d0-b958-4dc0-aa4d-ab8fc147ea6f"
    />
  );
}