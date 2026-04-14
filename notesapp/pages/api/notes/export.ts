import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getSession(req, res);
    if (!session) {
        return res.status(401).json({ message: "Nepřihlášen" });
    }

    const userId = session.user.id;
    const { id } = req.query;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    // Export jedné poznámky
    if (typeof id === "string") {
        const note = await prisma.note.findUnique({
            where: { id },
        });

        if (!note || note.userId !== userId) {
            return res.status(404).json({ message: "Poznámka nenalezena" });
        }

        const { userId: _, ...exported } = note;

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="note-${id}-${today}.json"`
        );
        return res.status(200).json(exported);
    }

    // Export všech poznámek
    const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
    });

    const exported = notes.map(({ userId: _, ...rest }) => rest);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="notes-export-${today}.json"`
    );
    return res.status(200).json(exported);
}