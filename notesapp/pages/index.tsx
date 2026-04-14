import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") router.push("/notes");
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    return null;
}