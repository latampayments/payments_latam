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

interface Steps {
  id: string;
  st1_pic: string | null;
  st1_text: string | null;
  st2_pic: string | null;
  st2_text: string | null;
  st3_pic: string | null;
  st3_text: string | null;
  st4_pic: string | null;
  st4_text: string | null;
  st5_pic: string | null;
  st5_text: string | null;
  st6_pic: string | null;
  st6_text: string | null;
  paymentId: string;
}
  

export const getCountries = async() => {
  const countries: Country[] = await prisma.country.findMany({
    select: {
      id: true,
      country: true,
      flag: true,
    }
  });
  return { countries }
}


export const getBanks = async() => {
  const banks: Bank[] = await prisma.bank.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      countryId: true
    }
  });
  return banks
};


export const getMethods = async() => {
  const methods: Methods[] = await prisma.payment.findMany({
    select: { id: true, type: true, symbol: true, limits: true, information: true, bankId: true}
  });
  return methods
};

export const getSteps = async() => {
  const steps: Steps[] = await prisma.steps.findMany({
    select: {id: true, st1_pic: true, st1_text: true, st2_pic: true, st2_text: true, st3_pic: true, st3_text: true, st4_pic: true, st4_text: true, st5_pic: true, st5_text: true, st6_pic: true, st6_text: true, paymentId: true
    }
  });
  return steps
};