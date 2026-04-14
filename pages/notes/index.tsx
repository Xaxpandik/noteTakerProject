import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Upload, Pencil, Trash2 } from "lucide-react";

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
}

export default function NotesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/notes")
                .then((res) => res.json())
                .then(setNotes);
        }
    }, [status]);

    async function handleDelete(id: string) {
        if (!confirm("Opravdu smazat?")) return;
        await fetch(`/api/notes/${id}`, { method: "DELETE" });
        setNotes((prev) => prev.filter((n) => n.id !== id));
    }

    function handleExportAll() {
        window.location.href = "/api/notes/export";
    }

    if (status === "loading") return null;

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Moje poznámky</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportAll}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link href="/notes/import">
                        <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                        </Button>
                    </Link>
                    <Link href="/notes/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nová
                        </Button>
                    </Link>
                </div>
            </div>

            {notes.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                    Zatím nemáte žádné poznámky.
                </p>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <Card
                            key={note.id}
                            className="transition-all hover:shadow-lg hover:border-primary/30"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Link href={`/notes/${note.id}`}>
                                        <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer">
                                            {note.title}
                                        </CardTitle>
                                    </Link>
                                    <div className="flex gap-2">
                                        <Link href={`/notes/${note.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(note.id)}
                                            className="hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {note.content || "Bez obsahu"}
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-3">
                                    Upraveno: {new Date(note.updatedAt).toLocaleString("cs-CZ")}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </Layout>
    );
}