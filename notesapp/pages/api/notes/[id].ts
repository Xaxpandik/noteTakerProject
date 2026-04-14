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
    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ message: "Neplatné ID" });
    }

    // Najdi poznámku a ověř vlastnictví
    const note = await prisma.note.findUnique({
        where: { id },
    });

    if (!note) {
        return res.status(404).json({ message: "Poznámka nenalezena" });
    }

    if (note.userId !== userId) {
        return res.status(404).json({ message: "Poznámka nenalezena" });
    }

    // GET — detail
    if (req.method === "GET") {
        return res.status(200).json(note);
    }

    // PUT — úprava
    if (req.method === "PUT") {
        const { title, content } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Název poznámky je povinný" });
        }

        const updated = await prisma.note.update({
            where: { id },
            data: {
                title: title.trim(),
                content: content ?? "",
            },
        });

        return res.status(200).json(updated);
    }

    // DELETE — smazání
    if (req.method === "DELETE") {
        await prisma.note.delete({
            where: { id },
        });

        return res.status(200).json({ message: "Poznámka smazána" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}