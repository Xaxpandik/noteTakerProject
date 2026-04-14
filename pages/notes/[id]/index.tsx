import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Pencil, ArrowLeft } from "lucide-react";

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export default function NoteDetailPage() {
    const { status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (id && status === "authenticated") {
            fetch(`/api/notes/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then(setNote)
                .catch(() => router.push("/notes"));
        }
    }, [id, status, router]);

    if (!note) return null;

    function handleExport() {
        window.location.href = `/api/notes/export?id=${note!.id}`;
    }

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link href={`/notes/${note.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4 mr-2" />
                            Upravit
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/notes")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Zpět
                    </Button>
                </div>
            </div>
            <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                    {note.content || "Bez obsahu"}
                </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
                <p>Vytvořeno: {new Date(note.createdAt).toLocaleString("cs-CZ")}</p>
                <p>Upraveno: {new Date(note.updatedAt).toLocaleString("cs-CZ")}</p>
            </div>
        </Layout>
    );
}