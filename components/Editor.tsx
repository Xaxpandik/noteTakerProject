"use client";

import { 
    BlockNoteSchema, 
    defaultBlockSpecs, 
    createCodeBlockSpec 
} from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Create a custom schema that includes the code block with highlighting
const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        codeBlock: createCodeBlockSpec(codeBlockOptions),
    },
});

interface EditorProps {
    onChange?: (content: string) => void;
    initialContent?: string;
    editable?: boolean;
}

export default function Editor({
    onChange,
    initialContent,
    editable = true,
}: EditorProps) {
    const initialContentParsed = useMemo(() => {
        if (!initialContent) return undefined;
        try {
            return JSON.parse(initialContent);
        } catch (e) {
            return undefined;
        }
    }, [initialContent]);

    const editor = useCreateBlockNote({
        schema,
        initialContent: initialContentParsed,
    });

    return (
        <div 
            className={cn(
                "w-full transition-all duration-200",
                editable ? "min-h-[400px] rounded-xl border bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40" : "bg-transparent"
            )}
        >
            <div className={cn(
                "w-full h-full py-4",
                editable ? "px-2" : "px-0"
            )}>
                <BlockNoteView
                    editor={editor}
                    editable={editable}
                    theme="dark"
                    onChange={() => {
                        if (onChange) {
                            onChange(JSON.stringify(editor.document));
                        }
                    }}
                />
            </div>
            
            <style jsx global>{`
                .bn-container, 
                .bn-editor,
                .bn-container[data-theme="dark"],
                .bn-container[data-theme="light"] {
                    background-color: transparent !important;
                    background: transparent !important;
                }

                .bn-editor {
                    padding-inline: ${editable ? "54px" : "0px"} !important;
                    color: inherit !important;
                }

                .bn-side-menu {
                    margin-left: 8px !important;
                }

                .bn-editor [data-placeholder]:before {
                    color: var(--muted-foreground) !important;
                    opacity: 0.4;
                }

                .bn-container {
                    min-height: auto !important;
                }

                /* Styling for the new Code Block with highlighting */
                .bn-block-content[data-content-type="codeBlock"] {
                    margin-top: 1rem !important;
                    margin-bottom: 1rem !important;
                }
                
                .bn-code-block-container {
                    border-radius: 0.75rem !important;
                    border: 1px solid var(--border) !important;
                    background-color: oklch(0.216 0.006 56.043 / 0.3) !important;
                }
                
                .bn-code-block-header {
                    border-bottom: 1px solid var(--border) !important;
                    background-color: oklch(0.216 0.006 56.043 / 0.5) !important;
                    padding: 0.5rem 1rem !important;
                }
            `}</style>
        </div>
    );
}
