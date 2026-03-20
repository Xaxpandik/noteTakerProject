import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res);
    if (!session) {
        return res.status(401).json({ message: "Nepřihlášen" });
    }

    const userId = session.user.id;

    // GET — seznam poznámek
    if (req.method === "GET") {
        const notes = await prisma.note.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
        });
        return res.status(200).json(notes);
    }

    // POST — nová poznámka
    if (req.method === "POST") {
        const { title, content } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Název poznámky je povinný" });
        }

        const note = await prisma.note.create({
            data: {
                title: title.trim(),
                content: content ?? "",
                userId,
            },
        });

        return res.status(201).json(note);
    }

    return res.status(405).json({ message: "Method not allowed" });
}