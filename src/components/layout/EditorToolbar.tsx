import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Quote, Highlighter, Heading1, Heading2, Heading3, 
  Undo, Redo, Code, Minus 
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-navy-800 bg-gray-50/50 dark:bg-navy-900/50">
      <button onClick={() => editor.chain().focus().undo().run()} className="p-1.5 hover:bg-gray-200 rounded"><Undo size={16} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-1.5 hover:bg-gray-200 rounded mr-2"><Redo size={16} /></button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 p-1.5 rounded' : 'p-1.5'}><Heading1 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 p-1.5 rounded' : 'p-1.5'}><Heading2 size={16} /></button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-navy-800 text-white p-1.5 rounded' : 'p-1.5'}><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-navy-800 text-white p-1.5 rounded' : 'p-1.5'}><Italic size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-navy-800 text-white p-1.5 rounded' : 'p-1.5'}><Underline size={16} /></button>

      {/* 🖍️ Highlighter Colors from your screenshot */}
      <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} className="p-1.5 hover:bg-yellow-100 rounded ml-2">
        <div className="w-4 h-4 bg-yellow-300 border border-yellow-400 rounded-sm" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#bbf7d0' }).run()} className="p-1.5 hover:bg-green-100 rounded">
        <div className="w-4 h-4 bg-green-300 border border-green-400 rounded-sm" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fecaca' }).run()} className="p-1.5 hover:bg-red-100 rounded">
        <div className="w-4 h-4 bg-red-300 border border-red-400 rounded-sm" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-1.5"><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-1.5"><ListOrdered size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="p-1.5"><Quote size={16} /></button>
    </div>
  );
};