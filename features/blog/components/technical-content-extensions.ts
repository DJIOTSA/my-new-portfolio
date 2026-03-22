import { Extension, Node, mergeAttributes } from "@tiptap/core";
import BaseTableCell from "@tiptap/extension-table-cell";
import BaseTableHeader from "@tiptap/extension-table-header";

export const RESOURCE_CARD_TYPES = [
  "dataset",
  "notebook",
  "kaggle",
  "chart",
  "reference",
  "resource"
] as const;

export const CALLOUT_VARIANTS = ["info", "note", "warning", "tip"] as const;

export type ResourceCardType = (typeof RESOURCE_CARD_TYPES)[number];
export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

interface CalloutAttributes {
  title: string;
  body: string;
  variant: CalloutVariant;
}

interface ResourceCardAttributes {
  title: string;
  description: string;
  url: string;
  resourceType: ResourceCardType;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    technicalContent: {
      setCalloutBlock: (attributes: CalloutAttributes) => ReturnType;
      setResourceCard: (attributes: ResourceCardAttributes) => ReturnType;
    };
  }
}

export const CalloutBlock = Node.create({
  name: "calloutBlock",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      title: { default: "Callout" },
      body: { default: "" },
      variant: { default: "info" as CalloutVariant }
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const attributes = HTMLAttributes as CalloutAttributes;

    return [
      "div",
      mergeAttributes(
        {
          "data-callout-block": "",
          "data-variant": attributes.variant,
          class: `blog-callout blog-callout-${attributes.variant}`
        },
        HTMLAttributes
      ),
      ["p", { class: "blog-callout-title" }, attributes.title],
      ["p", { class: "blog-callout-body" }, attributes.body]
    ];
  },

  addCommands() {
    return {
      setCalloutBlock: (attributes: CalloutAttributes) => ({ commands }) =>
        commands.insertContent({
          type: this.name,
          attrs: attributes
        })
    };
  }
});

export const ResourceCard = Node.create({
  name: "resourceCard",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      title: { default: "Technical resource" },
      description: { default: "" },
      url: { default: "" },
      resourceType: { default: "resource" as ResourceCardType }
    };
  },

  parseHTML() {
    return [{ tag: "div[data-resource-card]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const attributes = HTMLAttributes as ResourceCardAttributes;

    return [
      "div",
      mergeAttributes(
        {
          "data-resource-card": "",
          "data-resource-type": attributes.resourceType,
          class: "blog-resource-card"
        },
        HTMLAttributes
      ),
      ["p", { class: "blog-resource-type" }, attributes.resourceType],
      ["p", { class: "blog-resource-title" }, attributes.title],
      ["p", { class: "blog-resource-description" }, attributes.description],
      [
        "a",
        {
          href: attributes.url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "blog-resource-link"
        },
        attributes.url
      ]
    ];
  },

  addCommands() {
    return {
      setResourceCard: (attributes: ResourceCardAttributes) => ({ commands }) =>
        commands.insertContent({
          type: this.name,
          attrs: attributes
        })
    };
  }
});

const tableCellStylingAttributes = {
  backgroundColor: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.style.backgroundColor || null
  },
  borderColor: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.style.borderColor || null
  },
  borderStyle: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.style.borderStyle || null
  },
  borderWidth: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.style.borderWidth || null
  },
  textAlign: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.style.textAlign || null
  }
};

function buildTableCellStyle(attributes: {
  backgroundColor?: string | null;
  borderColor?: string | null;
  borderStyle?: string | null;
  borderWidth?: string | null;
  textAlign?: string | null;
}): string | undefined {
  const styles = [
    attributes.backgroundColor ? `background-color: ${attributes.backgroundColor}` : null,
    attributes.borderColor ? `border-color: ${attributes.borderColor}` : null,
    attributes.borderStyle ? `border-style: ${attributes.borderStyle}` : null,
    attributes.borderWidth ? `border-width: ${attributes.borderWidth}` : null,
    attributes.textAlign ? `text-align: ${attributes.textAlign}` : null
  ].filter(Boolean);

  return styles.length ? styles.join("; ") : undefined;
}

export const StyledTableCell = BaseTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...tableCellStylingAttributes
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { backgroundColor, borderColor, borderStyle, borderWidth, textAlign, ...rest } = HTMLAttributes as {
      backgroundColor?: string | null;
      borderColor?: string | null;
      borderStyle?: string | null;
      borderWidth?: string | null;
      textAlign?: string | null;
    } & Record<string, unknown>;
    const style = buildTableCellStyle({
      backgroundColor,
      borderColor,
      borderStyle,
      borderWidth,
      textAlign
    });

    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, rest, style ? { style } : {}),
      0
    ];
  }
});

export const StyledTableHeader = BaseTableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...tableCellStylingAttributes
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { backgroundColor, borderColor, borderStyle, borderWidth, textAlign, ...rest } = HTMLAttributes as {
      backgroundColor?: string | null;
      borderColor?: string | null;
      borderStyle?: string | null;
      borderWidth?: string | null;
      textAlign?: string | null;
    } & Record<string, unknown>;
    const style = buildTableCellStyle({
      backgroundColor,
      borderColor,
      borderStyle,
      borderWidth,
      textAlign
    });

    return [
      "th",
      mergeAttributes(this.options.HTMLAttributes, rest, style ? { style } : {}),
      0
    ];
  }
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {}
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) =>
        chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize: () => ({ chain }) =>
        chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run()
    };
  }
});
