import serverAuth from "@/lib/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";

export default async function (req: NextApiRequest, res: NextApiResponse){
    if (req.method !== "GET")  {
        return res.status(405).end()
    }

    try {
        await serverAuth(req)

        const series = await prismadb.movie.findMany({
            where: {
                category: "Series" 
            }
        })
        
        res.status(200).json(series)
    } catch (error) {
        console.log(error);
        return res.status(200).end()
    }
}