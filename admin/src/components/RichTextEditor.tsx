import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Code
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[#1f2937] bg-[#141a23]">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-[1px] h-6 bg-[#1f2937] mx-1 my-auto" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('codeBlock') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-[1px] h-6 bg-[#1f2937] mx-1 my-auto" />
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'}`}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2937] rounded-lg transition-colors"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2937] rounded-lg transition-colors"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[250px] p-4 focus:outline-none text-gray-200 leading-relaxed',
      },
    },
  });

  // Sync external value changes (e.g. on load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="bg-[#0e121a] border border-[#1f2937] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #6b7280;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    min-height: 250px;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid #3b82f6;
                    padding-left: 1rem;
                    margin-left: 0;
                    color: #9ca3af;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                }
            `}</style>
    </div>
  );
}
