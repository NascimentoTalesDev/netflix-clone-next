import serverAuth from "@/lib/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";

export default async function (req: NextApiRequest, res: NextApiResponse){
    if (req.method !== "GET")  {
        return res.status(405).end()
    }

    try {
        if (req.method !== 'GET') {
          return res.status(405).end();
        }
    
        const { currentUser } = await serverAuth(req);
    
        const favorites = await prismadb.movie.findMany({
          where: {
            id: {
              in: currentUser?.favoriteIds,


            },
          },
          orderBy :{
            id : "asc"
        }
        });
    
        return res.status(200).json(favorites);
      } catch (error) {
        console.log(error);
        return res.status(500).end();
      }
    }