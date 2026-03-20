import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
    return getServerSession(req, res, authOptions);
}