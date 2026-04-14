import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Upload, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { extractPlainText } from "@/lib/utils";

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
}

export default function NotesPage({ initialNotes }: { initialNotes: Note[] }) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);

    async function handleDelete(id: string) {
        if (!confirm("Opravdu smazat?")) return;
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (res.ok) {
            setNotes((prev) => prev.filter((n) => n.id !== id));
        }
    }

    function handleExportAll() {
        window.location.href = "/api/notes/export";
    }

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Moje poznámky</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportAll}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link href="/notes/import">
                        <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                        </Button>
                    </Link>
                    <Link href="/notes/new">
                        <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Nová
                        </Button>
                    </Link>
                </div>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">
                        Zatím nemáte žádné poznámky.
                    </p>
                    <Link href="/notes/new" className="mt-4 inline-block">
                        <Button variant="link">Vytvořit první poznámku</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {notes.map((note) => (
                        <Card
                            key={note.id}
                            className="group transition-all hover:shadow-md hover:border-primary/40 flex flex-col"
                        >
                            <CardHeader className="pb-3 flex-none">
                                <div className="flex items-start justify-between gap-4">
                                    <Link href={`/notes/${note.id}`} className="flex-1">
                                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
                                            {note.title}
                                        </CardTitle>
                                    </Link>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <Link href={`/notes/${note.id}/edit`}>
                                            <Button variant="ghost" size="icon-sm">
                                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleDelete(note.id)}
                                            className="hover:text-destructive"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                    {extractPlainText(note.content)}
                                </p>
                                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                                    Aktualizace: {new Date(note.updatedAt).toLocaleDateString("cs-CZ")}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const notes = await prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
    });

    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
            initialNotes: JSON.parse(JSON.stringify(notes)),
        },
    };
};