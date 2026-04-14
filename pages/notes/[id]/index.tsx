import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Pencil, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export default function NoteDetailPage({ note }: { note: Note }) {
    const router = useRouter();

    function handleExport() {
        window.location.href = `/api/notes/export?id=${note.id}`;
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
            <div className="mb-8">
                <Editor initialContent={note.content} editable={false} />
            </div>
            <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
                <p>Vytvořeno: {new Date(note.createdAt).toLocaleString("cs-CZ")}</p>
                <p>Upraveno: {new Date(note.updatedAt).toLocaleString("cs-CZ")}</p>
            </div>
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