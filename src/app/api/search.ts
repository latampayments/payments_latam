import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/db';

interface Country {
  id: string;
  country: string;
  flag: string;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  countryId: string;
}

interface Methods {
  id: string;
  type: string;
  symbol: string;
  limits: string | null;
  information: string | null;
  bankId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET') {
        try {
            const {query: query} = req.query;
            
            if(typeof query !== 'string') throw new Error('Invalid query');

            const data: Array<Country & { banks: Bank[] }> = await prisma.country.findMany({
                where: { 
                   country: {
                        contains: query,
                        mode: "insensitive",
                      }
                },
                include: {
                  banks: true,
                },
              });
        
            
            console.log('api', data);
            res.status(200).json({ query: data});
        } catch(e) {
            res.status(500).end()
        }
    }
}