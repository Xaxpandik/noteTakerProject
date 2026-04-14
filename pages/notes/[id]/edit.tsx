import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface Note {
    id: string;
    title: string;
    content: string;
}

export default function EditNotePage({ note }: { note: Note }) {
    const router = useRouter();
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch(`/api/notes/${note.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.message);
            return;
        }

        router.push(`/notes/${note.id}`);
    }

    return (
        <Layout>
            <h1 className="text-3xl font-bold tracking-tight mb-8">
                Upravit poznámku
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 max-w-xl">
                    <Label htmlFor="title">Název</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Obsah</Label>
                    <Editor
                        initialContent={note.content}
                        onChange={setContent}
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

    const { id } = context.query;
    const note = await prisma.note.findUnique({
        where: { id: id as string },
    });

    if (!note || note.userId !== session.user.id) {
        return {
            redirect: {
                destination: "/notes",
                permanent: false,
            },
        };
    }

    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
            note: JSON.parse(JSON.stringify(note)),
        },
    };
    };