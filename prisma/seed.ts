import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("ABCabc123", 10);

    const user = await prisma.user.upsert({
        where: { name: "demo" },
        update: {},
        create: {
            name: "demo",
            password: hashedPassword,
        },
    });

    const notes = [
        {
            title: "Jak fungují API routy v Next.js",
            content: "API routy v Next.js se vytvářejí jako soubory ve složce pages/api/...",
        },
        {
            title: "Co je to middleware v Next.js",
            content: "Middleware je funkce, která se spustí před zpracováním requestu...",
        },
        {
            title: "Jak funguje Prisma",
            content: "Prisma je ORM pro Node.js a TypeScript...",
        },
        {
            title: "Jak funguje useForm hook",
            content: "useForm je hook z knihovny react-hook-form...",
        },
        {
            title: "Co je NextAuth a jak se používá",
            content: "NextAuth je autentizační knihovna pro Next.js...",
        },
        {
            title: "Jak se nasazuje na Vercel",
            content: "Vercel je platforma pro nasazení Next.js aplikací...",
        },
    ];

    for (const note of notes) {
        await prisma.note.create({
            data: {
                ...note,
                userId: user.id,
            },
        });
    }

    console.log("Seed dokončen: uživatel 'demo' s", notes.length, "poznámkami");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());