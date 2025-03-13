
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor = ({ value, onChange, height = 300, placeholder, readOnly = false }: RichTextEditorProps) => {
  // For read-only mode, we'll use a separate component for consistent display
  if (readOnly) {
    return (
      <div 
        className="rich-text-content prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }
  
  return (
    <Editor
      apiKey="70jtps1huxsr2ysuwbmm8u9c1j2kgb5j14030vcs3pfxjjcn"
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; 
            font-size: 14px;
            line-height: 1.5;
          }
          p { margin: 0 0 1em 0; }
          ul, ol { margin: 0 0 1em 0; padding-left: 2em; }
          li { margin-bottom: 0.5em; }
          a { color: #0ea5e9; text-decoration: underline; }
          h1, h2, h3, h4, h5, h6 { font-weight: bold; margin: 1.5em 0 0.5em 0; }
          h1 { font-size: 1.8em; }
          h2 { font-size: 1.6em; }
          h3 { font-size: 1.4em; }
          h4 { font-size: 1.2em; }
          h5, h6 { font-size: 1em; }
        `,
        placeholder: placeholder,
        skin: 'oxide-dark',
        content_css: 'dark',
        branding: false,
        promotion: false,
        statusbar: false
      }}
    />
  );
};

export default RichTextEditor;
