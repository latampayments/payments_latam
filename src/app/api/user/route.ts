import { User, Password } from "@prisma/client";
import { NextResponse } from "next/server"
import  prisma  from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

const UserSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  });

export async function POST(req: Request) {
    try{
        let body = await req.json();
        const { email, username, password} = UserSchema.parse(body);
        let userReady = await verifyUser(username, email);
        
        if(userReady) {
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
            return NextResponse.json({user: session, message: 'Success'}, {status: 200})
        }
    }catch(e){
        return NextResponse.json({message: 'Something went wrong'}, {status: 500})
    }
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function verifyUser(
    username: User['username'],
	email: User['email']) {
    let existingUserEmail = await prisma.user.findUnique({
        where: {
            email}
    });
    if (existingUserEmail) {
        return NextResponse.json({user: null, message: 'Email already used'}, {status: 409})
    }

    let existingUsername = await prisma.user.findUnique({
        where: {
            username}
    });
    if (existingUsername) {
        return NextResponse.json({user: null, message: 'Username already exists'}, {status: 409})
    }
    return {status: true}
}