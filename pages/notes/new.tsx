import { useState } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";

// Dynamically import the editor with no SSR
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function NewNotePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.message);
            return;
        }

        router.push("/notes");
    }

    return (
        <Layout>
            <h1 className="text-3xl font-bold tracking-tight mb-8">Nová poznámka</h1>
            <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                <div className="space-y-2">
                    <Label htmlFor="title">Název</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Název poznámky"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Obsah</Label>
                    <Editor onChange={setContent} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-3 pt-2">
                    <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        Vytvořit
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

    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
        },
    };
    };