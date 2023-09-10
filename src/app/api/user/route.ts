import { User, Password } from "@prisma/client";
import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';

//const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

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
        let userReady = await prisma.user.findUnique({where: {email}});
        if (userReady) {
            return NextResponse.json({user: null, message: 'Email already used'}, {status: 409})
        }
    
        let existingUsername = await prisma.user.findUnique({where: {username}});
        if (existingUsername) {
            return NextResponse.json({user: null, message: 'Username already exists'}, {status: 409})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
    
          const user = await prisma.user.create({
              data: {
                email,
                username,
                roles: { connect: [{ name: 'user' }] },
                password: {
                  create: {
                    hash: hashedPassword,
                  },
                },
              },
            });
          return NextResponse.json({user: user, message: 'Success'}, {status: 201})
    }catch(e){
        return NextResponse.json({message: 'Something went wrong'}, {status: 500})
    }
}
