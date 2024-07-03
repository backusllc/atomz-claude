import React, { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import YouTube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import {
  Button,
  Input,
  Switch,
  Select,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui";
import {
  Loader2,
  X,
  Plus,
  Image as ImageIcon,
  Video,
  Mic,
  Save,
  History,
  Globe,
  Calendar,
  Search,
  Eye,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Table as TableIcon,
  Link as LinkIcon,
  Strikethrough,
  Palette,
  Type,
  Heading1,
  Heading2,
} from "lucide-react";
import debounce from "lodash/debounce";
import { format } from "date-fns";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} variant="outline" size="sm">
        <Undo className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} variant="outline" size="sm">
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={editor.isActive("underline") ? "default" : "outline"}
        size="sm"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "outline"}
        size="sm"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        size="sm"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        size="sm"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
        size="sm"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
        size="sm"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
        size="sm"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        variant="outline"
        size="sm"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <input
        type="color"
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes("textStyle").color}
        className="w-9 h-9 p-1 rounded border"
      />
    </div>
  );
};

const LightBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="flex bg-white border rounded-md shadow-lg p-1">
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          size="sm"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          size="sm"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant={editor.isActive("paragraph") ? "default" : "ghost"}
          size="sm"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </FloatingMenu>
  );
};

const BlogPostEditor = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [tags, setTags] = useState(initialData.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(initialData.isPublished || false);
  const [coverImage, setCoverImage] = useState(initialData.coverImage || null);
  const [publishDate, setPublishDate] = useState(initialData.publishDate || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      YouTube,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
    ],
    content: initialData.content || "",
    autofocus: false,
    editable: true,
  });

  const handleImageUpload = useCallback(
    file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    },
    [editor]
  );

  const handleSave = async (shouldClose = true) => {
    const content = editor.getHTML();
    const postData = {
      title,
      content,
      tags,
      isPublished,
      coverImage,
      publishDate,
    };
    await onSave(postData);
    if (shouldClose) onClose();
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>投稿を新規追加</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="flex-grow flex gap-4 overflow-hidden">
          <div className="flex-grow overflow-y-auto">
            <div className="space-y-4 p-4">
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="タイトルを入力..."
                className="text-2xl font-bold"
              />
              <div className="border rounded-md p-4">
                <MenuBar editor={editor} />
                {editor && (
                  <>
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                      <Button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive("bold") ? "is-active" : ""}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive("italic") ? "is-active" : ""}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive("strike") ? "is-active" : ""}
                      >
                        <Strikethrough className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          const url = window.prompt("URL:");
                          if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                          }
                        }}
                        className={editor.isActive("link") ? "is-active" : ""}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </BubbleMenu>
                    <LightBar editor={editor} />
                  </>
                )}
                <EditorContent editor={editor} className="prose max-w-none" />
              </div>
            </div>
          </div>
          <div className="w-64 border-l p-4 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タグ</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-xs">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="新しいタグ..."
                  className="flex-grow"
                />
                <Button onClick={handleAddTag} variant="outline" className="ml-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公開日</label>
              <Input type="datetime-local" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">公開する</span>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">サムネイル画像</label>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-md" />
                  <Button variant="secondary" size="sm" className="absolute top-2 right-2" onClick={() => setCoverImage(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md">
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    accept="image/*"
                  />
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">画像をアップロード</span>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={() => handleSave(true)}>
            <Save className="h-4 w-4 mr-2" />
            保存して閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;
