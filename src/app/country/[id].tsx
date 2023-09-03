'use client';
import prisma from '@/lib/db';
import { GetStaticProps, InferGetServerSidePropsType } from 'next/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import Image from 'next/image';

interface Bank {
  id: string;
  name: string;
  logo: string;

}
const Bank = ({banks}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  let data: Bank[] = banks
  return (
    <div className="static mt-[400px] flex justify-center p-2">
      <div className="w-full flex flex-wrap right-0 justify-around space-x-2 space-y-2 items-center lg:justify-between sm:justify-center md:justify-center">
        {data.map((ct) => 
        <Link key={ct.id} href={`/payment/${ct.id}`} className='justify-center text-center'>
          <Card className='bg-slate-200'>
            <CardHeader>
              <CardTitle>{ct.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                className="rounded-sm h-48 w-48 object-cover object-center"
                src={ct.logo}
                alt={ct.name}
                width={400}
                height={400}
              />
            </CardContent>
          </Card>
        </Link>
        )}
      </div>
    </div>
    )
}

export default Bank

export async function getStaticProps({params}: any) {
  console.log(params)
  let banks = await prisma.bank.findMany({
    where: {countryId: params.countryId}
  })
  return {
    props: {
      banks
    }
  }
}