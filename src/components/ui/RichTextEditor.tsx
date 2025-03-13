
import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...', height = 300 }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // TinyMCE API key - using a free API key for development
  // In production, you should use your own API key from TinyMCE
  const TINYMCE_API_KEY = 'no-api-key';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full bg-secondary/20 animate-pulse rounded-md" style={{ height: `${height}px` }}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      apiKey={TINYMCE_API_KEY}
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
        placeholder,
        branding: false,
      }}
    />
  );
};

export default RichTextEditor;
