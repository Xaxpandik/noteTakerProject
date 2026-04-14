import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft, CheckCircle } from "lucide-react";

export default function ImportPage() {
    const { status } = useSession();
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        setError("");
        setSuccess("");

        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            const res = await fetch("/api/notes/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            setSuccess(data.message);
        } catch {
            setError("Neplatný JSON soubor");
        }
    }

    return (
        <Layout>
            <h1 className="text-3xl font-bold tracking-tight mb-8">
                Import poznámek
            </h1>
            <div className="max-w-xl space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="file">Vyberte JSON soubor</Label>
                    <Input
                        id="file"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {success && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium">{success}</p>
                            <Button
                                size="sm"
                                className="mt-2"
                                onClick={() => router.push("/notes")}
                            >
                                Zpět na poznámky
                            </Button>
                        </div>
                    </div>
                )}
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zpět
                </Button>
            </div>
        </Layout>
    );
}