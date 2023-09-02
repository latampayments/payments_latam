
import { type Password, type User } from '@prisma/client';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import bcrypt from 'bcryptjs';

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials): Promise<any> {
            if(!credentials?.email || !credentials?.password) return null
            const user = await verifyUserPassword(credentials?.email , credentials?.password);
            
            if (!user) return null
            return {
              id: user.data.id,
              email: user.data.email,
              username: user.data.username
            }
            /* const session = await prisma.session.create({
                select: { id: true, expirationDate: true, userId: true },
                data: {
                    expirationDate: getSessionExpirationDate(),
                    userId: user.id,
                },
            })
            return session */
          }
        })
    ]
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function verifyUserPassword(email: string, password: string) {
	const userWithPassword = await prisma.user.findUnique({
		where: { email },
		select: { id: true, username: true, email: true, password: { select: { hash: true } } },
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) {
		return null
	}

	return { data: userWithPassword }
}