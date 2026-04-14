import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getSession(req, res);
    if (!session) {
        return res.status(401).json({ message: "Nepřihlášen" });
    }

    const userId = session.user.id;
    const body = req.body;

    // Normalizace — objekt nebo pole
    const items: unknown[] = Array.isArray(body) ? body : [body];

    if (items.length === 0) {
        return res.status(400).json({ message: "Žádné poznámky k importu" });
    }

    const created = [];

    for (const item of items) {
        if (typeof item !== "object" || item === null) {
            continue;
        }

        const { title, content, createdAt, updatedAt } = item as Record<string, unknown>;

        if (!title || typeof title !== "string" || title.trim() === "") {
            continue; // přeskoč nevalidní položky
        }

        const note = await prisma.note.create({
            data: {
                title: title.trim(),
                content: typeof content === "string" ? content : "",
                createdAt: typeof createdAt === "string" ? new Date(createdAt) : new Date(),
                updatedAt: typeof updatedAt === "string" ? new Date(updatedAt) : new Date(),
                userId,
            },
        });

        created.push(note);
    }

    return res.status(201).json({
        message: `Importováno ${created.length} poznámek`,
        count: created.length,
    });
}