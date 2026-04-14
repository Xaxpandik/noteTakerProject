"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useMemo } from "react";

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
        <div className="min-h-[300px] border rounded-md p-4 bg-background transition-colors focus-within:border-ring/50">
            <BlockNoteView
                editor={editor}
                editable={editable}
                onChange={() => {
                    if (onChange) {
                        onChange(JSON.stringify(editor.document));
                    }
                }}
            />
        </div>
    );
}
