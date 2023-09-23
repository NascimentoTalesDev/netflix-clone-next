import bcrypt from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next"
import  prismadb from "@/lib/prismadb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end()
    }
    const { email, name, password } = req.body

    if (!name) {
        return res.status(400).json({ type:"name", message: "Username is required!"})
    }

    if (!email) {
        return res.status(400).json({ type:"email", message: "Email is required!"})
    }

    if (!password) {
        return res.status(400).json({ type:"password", message: "Password is required!" })
    }

    const existingUser = await prismadb.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        return res.status(422).json({ type:"email in use", message: "Email already in use!" })
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date()
            }
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log(error);
        res.status(400).end()
    }
}








