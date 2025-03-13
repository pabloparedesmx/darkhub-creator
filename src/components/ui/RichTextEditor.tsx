
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, height = 300, placeholder }: RichTextEditorProps) => {
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
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
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
