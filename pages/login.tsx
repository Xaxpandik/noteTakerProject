import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            name,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Neplatné jméno nebo heslo");
            return;
        }

        router.push("/notes");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Přihlášení</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Zadejte své přihlašovací údaje
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Jméno</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Vaše uživatelské jméno"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Heslo</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            <LogIn className="w-4 h-4 mr-2" />
                            {loading ? "Přihlašování..." : "Přihlásit"}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Nemáte účet?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Registrace
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}