import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";

export default function EditNotePage() {
    const { status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

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
                .then((note) => {
                    setTitle(note.title);
                    setContent(note.content);
                    setLoaded(true);
                })
                .catch(() => router.push("/notes"));
        }
    }, [id, status, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.message);
            return;
        }

        router.push(`/notes/${id}`);
    }

    if (!loaded) return null;

    return (
        <Layout>
            <h1 className="text-3xl font-bold tracking-tight mb-8">
                Upravit poznámku
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                <div className="space-y-2">
                    <Label htmlFor="title">Název</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="content">Obsah</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-3 pt-2">
                    <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        Uložit
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Zpět
                    </Button>
                </div>
            </form>
        </Layout>
    );
}