import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "Jméno a heslo jsou povinné" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Heslo musí mít alespoň 6 znaků" });
    }

    const existing = await prisma.user.findUnique({
        where: { name },
    });

    if (existing) {
        return res.status(409).json({ message: "Uživatel s tímto jménem již existuje" });
    }

    const hashed = await hashPassword(password);

    await prisma.user.create({
        data: { name, password: hashed },
    });

    return res.status(201).json({ message: "Registrace úspěšná" });
}