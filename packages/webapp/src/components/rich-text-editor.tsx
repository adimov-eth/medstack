'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  List,
  FileImage,
  Link,
  Heading2,
  Paperclip
} from 'lucide-react';

const RichTextEditor = ({ 
  initialValue = '', 
  onChange,
  placeholder = 'Start typing your medical case description...',
  maxLength = 10000
}: {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Helper function to maintain cursor position after format
  const updateTextWithFormat = (formatFn: (text: string) => string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = (editor as HTMLTextAreaElement).selectionStart;
    const end = (editor as HTMLTextAreaElement).selectionEnd;
    const text = (editor as HTMLTextAreaElement).value;

    const beforeSelection = text.substring(0, start);
    const selection = text.substring(start, end);
    const afterSelection = text.substring(end);

    const formattedSelection = formatFn(selection);
    const newText = beforeSelection + formattedSelection + afterSelection;

    onChange(newText);

    // Restore selection after React rerender
    setTimeout(() => {
      const editorElement = editor as HTMLTextAreaElement;
      editorElement.focus();
      editorElement.setSelectionRange(start, start + formattedSelection.length);
    }, 0);
  };

  const formatters: Record<string, (text: string) => string> = {
    bold: (text: string) => `**${text}**`,
    italic: (text: string) => `*${text}*`, 
    heading: (text: string) => `## ${text}`,
    list: (text: string) => text.split('\n').map((line: string) => `- ${line}`).join('\n'),
  };

  const handleFormat = (type: string) => {
    updateTextWithFormat(formatters[type]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to Supabase Storage
      // For now, we'll just insert a placeholder
      updateTextWithFormat(() => `![Image](uploading...)`);
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl) {
      updateTextWithFormat((text) => `[${text || 'link'}](${linkUrl})`);
      setLinkUrl('');
      setIsLinkModalOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      updateTextWithFormat((text) => '    ' + text);
    }

    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        default:
          break;
      }
    }
  };

  // Custom hook for syntax highlighting (simplified version)
  const getHighlightedValue = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/##\s(.*?)$/gm, '<h2>$1</h2>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Clean and sanitize pasted content
    const sanitizedText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/^\s+|\s+$/g, ''); // Trim whitespace

    updateTextWithFormat(() => sanitizedText);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Toolbar */}
        <div className="flex items-center space-x-1 border-b pb-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('heading')}
            title="Heading"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('list')}
            title="List"
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Insert Image"
          >
            <FileImage className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLinkModalOpen(true)}
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Attach File"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor Area */}
        <div className="relative">
          <textarea
            ref={editorRef}
            className="w-full min-h-[200px] p-3 text-base leading-relaxed resize-y rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={initialValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-sm text-gray-400">
            {initialValue.length} / {maxLength}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {/* Link Modal */}
        {isLinkModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-96">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-medium">Insert Link</h3>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsLinkModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleLinkInsert}>Insert</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preview (optional) */}
        <div className="mt-4 p-3 border rounded-md bg-gray-50">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: getHighlightedValue(initialValue) 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;