import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractPlainText(content: string): string {
    if (!content) return "Bez obsahu";
    try {
        const blocks = JSON.parse(content);
        if (!Array.isArray(blocks)) return content;

        return blocks
            .map((block: any) => {
                if (Array.isArray(block.content)) {
                    return block.content.map((c: any) => c.text).join("");
                }
                return "";
            })
            .join(" ")
            .trim() || "Bez obsahu";
    } catch (e) {
        // Fallback for non-JSON content
        return content;
    }
}
