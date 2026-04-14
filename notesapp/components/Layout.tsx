import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, StickyNote } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-card">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/notes"
                        className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        <StickyNote className="w-5 h-5" />
                        Poznámky
                    </Link>
                    {session && (
                        <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
                            <Button variant="outline" size="sm" onClick={() => signOut()}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Odhlásit
                            </Button>
                        </div>
                    )}
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 py-10">{children}</main>
        </div>
    );
}