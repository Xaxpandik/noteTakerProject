"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

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
            `}</style>
        </div>
    );
}
