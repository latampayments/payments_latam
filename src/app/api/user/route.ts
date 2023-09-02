import { User, Password } from "@prisma/client";
import { NextResponse } from "next/server"
import  prisma  from "@/lib/db";
import bcrypt from "bcryptjs";


const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

export async function POST(req: Request) {
    try{
        let body = await req.json();
        const { email, username, password} = body;
        let isVerified = verifyUserPassword({username}, password);
        if (!isVerified) return null
        
        const hashedPassword = await getPasswordHash(password)

        const session = await prisma.session.create({
            data: {
                expirationDate: new Date(Date.now() + SESSION_EXPIRATION_TIME),
                user: {
                    create: {
                        email,
                        username,
                        password: {
                            create: {
                                hash: hashedPassword,
                            },
                        },
                    },
                },
            },
            select: { id: true, expirationDate: true },
        })
        return NextResponse.json({session})
    }catch(e){
        return e
    }
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}


export async function verifyUserPassword(
	where: Pick<User, 'username'> | Pick<User, 'id'>,
	password: Password['hash'],
) {
	const userWithPassword = await prisma.user.findUnique({
		where,
		select: { id: true, password: { select: { hash: true } } },
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) {
		return null
	}

	return { id: userWithPassword.id }
}