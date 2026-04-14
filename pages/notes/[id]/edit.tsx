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
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">Upravit poznámku</h1>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zrušit
                        </Button>
                        <Button type="submit" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Uložit
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Zadejte název..."
                            className="text-2xl font-bold h-12 border-none bg-transparent pl-[54px] pr-0 focus-visible:ring-0 placeholder:text-muted-foreground/30"
                            required
                        />
                        <div className="h-px bg-border w-full" />
                    </div>
                    
                    <div className="space-y-2">
                        <Editor
                            initialContent={note.content}
                            onChange={setContent}
                        />
                    </div>
                </div>
                
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                        {error}
                    </div>
                )}
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