"use client";

import "katex/dist/katex.min.css";
import { useEffect } from "react";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Mathematics from "@tiptap/extension-mathematics";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { createLowlight, common } from "lowlight";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import {
  CALLOUT_VARIANTS,
  CalloutBlock,
  FontSize,
  RESOURCE_CARD_TYPES,
  ResourceCard,
  StyledTableCell,
  StyledTableHeader,
  type CalloutVariant,
  type ResourceCardType
} from "@/components/organisms/blog/technical-content-extensions";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  contentHtml: string;
  contentJson: string;
  onChange: (value: { html: string; json: string }) => void;
  layout?: "inline" | "sidebar";
}

function parseStoredContent(contentJson: string, contentHtml: string): JSONContent | string {
  if (contentJson.trim()) {
    try {
      const parsed = JSON.parse(contentJson) as JSONContent;
      if (parsed && typeof parsed === "object" && parsed.type) {
        return parsed;
      }
    } catch {
      // Fall back to stored HTML when JSON parsing fails.
    }
  }

  return contentHtml;
}

function promptForUrl(message: string, initialValue = "https://"): string | null {
  const value = window.prompt(message, initialValue);
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

function promptForText(message: string, initialValue = ""): string | null {
  const value = window.prompt(message, initialValue);
  if (value === null) {
    return null;
  }

  return value.trim();
}

export function TiptapEditor({ contentHtml, contentJson, onChange, layout = "inline" }: TiptapEditorProps) {
  const isSidebarLayout = layout === "sidebar";
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      CodeBlockLowlight.configure({
        lowlight
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"
      }),
      Mathematics,
      Placeholder.configure({
        placeholder: "Start writing the article..."
      }),
      TextStyle,
      Color,
      FontSize,
      Highlight,
      Underline,
      Image.configure({
        inline: false
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      StyledTableHeader,
      StyledTableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      CalloutBlock,
      ResourceCard
    ],
    content: parseStoredContent(contentJson, contentHtml),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "ProseMirror blog-editor"
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange({
        html: currentEditor.getHTML(),
        json: JSON.stringify(currentEditor.getJSON())
      });
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = parseStoredContent(contentJson, contentHtml);
    const currentJson = JSON.stringify(editor.getJSON());
    const nextJson = typeof nextContent === "string" ? "" : JSON.stringify(nextContent);

    if (nextJson && currentJson !== nextJson) {
      editor.commands.setContent(nextContent, false);
      return;
    }

    if (!nextJson && editor.getHTML() !== contentHtml) {
      editor.commands.setContent(nextContent, false);
    }
  }, [contentHtml, contentJson, editor]);

  const toolbar = (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-sm font-medium text-slate-900">Document Body</p>
        <p className="text-xs text-slate-600">
          Write inside the document canvas below. Every toolbar action applies to that field.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={
            editor?.isActive("heading", { level: 2 })
              ? "h2"
              : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : "paragraph"
          }
          onValueChange={(value: "paragraph" | "h2" | "h3") => {
            if (!editor) {
              return;
            }

            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
              return;
            }

            editor.chain().focus().toggleHeading({ level: value === "h2" ? 2 : 3 }).run();
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="17px" onValueChange={(value) => editor?.chain().focus().setFontSize(value).run()}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="14px">14 px</SelectItem>
            <SelectItem value="16px">16 px</SelectItem>
            <SelectItem value="17px">17 px</SelectItem>
            <SelectItem value="20px">20 px</SelectItem>
            <SelectItem value="24px">24 px</SelectItem>
            <SelectItem value="32px">32 px</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          Underline
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHighlight().run()}>
          Highlight
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
          Left
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
          Center
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
          Right
        </Button>
        <label className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700">
          Text
          <input
            type="color"
            defaultValue="#1f2937"
            onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()}
          />
        </label>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          Bullets
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          Numbers
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          Quote
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          Code
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().undo().run()}>
          Undo
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().redo().run()}>
          Redo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const formula = promptForText("Inline math formula", "E = mc^2");
            if (!formula) {
              return;
            }

            editor?.chain().focus().insertContent(`$${formula}$`).run();
          }}
        >
          Math
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const url = promptForUrl("Image URL");
            if (!url) {
              return;
            }

            const alt = promptForText("Image alt text", "") ?? "";
            editor?.chain().focus().setImage({ src: url, alt }).run();
          }}
        >
          Image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const url = promptForUrl("Link URL");
            if (!url) {
              return;
            }

            editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          Link
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          Insert Table
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().addRowBefore().run()}>
          Row Before
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().addRowAfter().run()}>
          Row After
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().deleteRow().run()}>
          Delete Row
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().addColumnBefore().run()}>
          Col Before
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().addColumnAfter().run()}>
          Col After
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().deleteColumn().run()}>
          Delete Col
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().mergeCells().run()}>
          Merge Cells
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().splitCell().run()}>
          Split Cell
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeaderRow().run()}>
          Header Row
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}>
          Header Col
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeaderCell().run()}>
          Header Cell
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().deleteTable().run()}>
          Delete Table
        </Button>
        <label className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700">
          Cell Fill
          <input
            type="color"
            defaultValue="#f8fafc"
            onChange={(event) =>
              editor?.chain().focus().setCellAttribute("backgroundColor", event.target.value).run()
            }
          />
        </label>
        <label className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700">
          Border
          <input
            type="color"
            defaultValue="#cbd5e1"
            onChange={(event) =>
              editor?.chain().focus().setCellAttribute("borderColor", event.target.value).run()
            }
          />
        </label>
        <Select
          defaultValue="solid"
          onValueChange={(value: "solid" | "dashed" | "dotted" | "double") =>
            editor?.chain().focus().setCellAttribute("borderStyle", value).run()
          }
        >
          <SelectTrigger className="w-[145px]">
            <SelectValue placeholder="Border style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
            <SelectItem value="double">Double</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue="1px"
          onValueChange={(value: "1px" | "2px" | "3px" | "4px") =>
            editor?.chain().focus().setCellAttribute("borderWidth", value).run()
          }
        >
          <SelectTrigger className="w-[145px]">
            <SelectValue placeholder="Border width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1px">1 px</SelectItem>
            <SelectItem value="2px">2 px</SelectItem>
            <SelectItem value="3px">3 px</SelectItem>
            <SelectItem value="4px">4 px</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue="left"
          onValueChange={(value: "left" | "center" | "right") =>
            editor?.chain().focus().setCellAttribute("textAlign", value).run()
          }
        >
          <SelectTrigger className="w-[145px]">
            <SelectValue placeholder="Cell align" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Cell Left</SelectItem>
            <SelectItem value="center">Cell Center</SelectItem>
            <SelectItem value="right">Cell Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const title = promptForText("Callout title", "Key insight");
            if (!title) {
              return;
            }

            const body = promptForText("Callout body", "Explain the important point for the reader.");
            if (!body) {
              return;
            }

            const variantPrompt = promptForText(`Callout variant: ${CALLOUT_VARIANTS.join(", ")}`, "info");
            const variant = CALLOUT_VARIANTS.includes((variantPrompt ?? "info") as CalloutVariant)
              ? ((variantPrompt ?? "info") as CalloutVariant)
              : "info";

            editor?.chain().focus().setCalloutBlock({ title, body, variant }).run();
          }}
        >
          Callout
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const resourceTypePrompt = promptForText(
              `Resource type: ${RESOURCE_CARD_TYPES.join(", ")}`,
              "dataset"
            );
            const resourceType = RESOURCE_CARD_TYPES.includes(
              (resourceTypePrompt ?? "resource") as ResourceCardType
            )
              ? ((resourceTypePrompt ?? "resource") as ResourceCardType)
              : "resource";
            const title = promptForText("Resource title", "Sample dataset");
            const description = promptForText(
              "Resource description",
              "Explain why this resource matters for the article."
            );
            const url = promptForUrl("Resource URL");

            if (!title || !description || !url) {
              return;
            }

            editor?.chain().focus().setResourceCard({ title, description, url, resourceType }).run();
          }}
        >
          Resource Card
        </Button>
      </div>
    </div>
  );

  const canvas = (
    <div className="rounded-[28px] border border-slate-200 bg-slate-100 p-4 sm:p-6">
      <EditorContent editor={editor} />
    </div>
  );

  if (isSidebarLayout) {
    return (
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <div className="sticky top-4">{toolbar}</div>
        {canvas}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-4 z-10">{toolbar}</div>
      {canvas}
    </div>
  );
}
