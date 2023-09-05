"use Client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CartItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

const CartPage = () => {
  //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartItems: CartItem[] = [
    {
      id: 1,
      productName: "Monthly package",
      quantity: 1,
      unitPrice: 100,
    },
  ];
  // setCartItems(itens)

  //   useEffect(() => {
  //     // Faça uma chamada à sua API ou banco de dados para buscar os itens do carrinho do usuário
  //     async function fetchCartItems() {
  //       try {
  //         const response = await prisma.cartItem.findMany();
  //         setCartItems(response);
  //       } catch (error) {
  //         console.error('Erro ao buscar itens do carrinho', error);
  //       }
  //     }

  //     fetchCartItems();
  //   }, []);

  //   // Função para remover um item do carrinho
  //   const removeItemFromCart = async (itemId: number) => {
  //     // Implemente a lógica para remover o item do carrinho no seu backend
  //     try {
  //       await prisma.cartItem.delete({
  //         where: { id: itemId },
  //       });
  //       // Atualize a lista de itens no carrinho após a remoção
  //       setCartItems(cartItems.filter((item) => item.id !== itemId));
  //     } catch (error) {
  //       console.error('Erro ao remover item do carrinho', error);
  //     }
  //   };

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your cart</CardTitle>
            <CardDescription>Itens in your cart</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
          
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                <TableRow key={item.id}>
           
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice}</TableCell>
                  <TableCell className="text-right">${item.quantity * item.unitPrice}</TableCell>
                </TableRow>
              ))}
                
              </TableBody>
            </Table>
          </CardContent>

          <CardFooter>
            <div className="w-full flex flex-wrap right-0 justify-around space-x-4 space-y-4 items-center lg:justify-between sm:justify-center md:justify-center">
              <Button>Back to home</Button>

              <Link href={`/method/`} className="justify-center text-center" />

              <Button>Checkout</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default CartPage;

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Link from "next/link";
// import Image from "next/image";
// import { getMethods } from "@/lib/api";

// type Params = {
//   params: {
//     bankId: string;
//   };
// };

// export default async function Bank({ params: { bankId } }: Params) {
//   let fetchedMethods = await getMethods();
//   const methodsFetched = await Promise.all(fetchedMethods);
//   let methods = methodsFetched.filter((dt) => dt.bankId === bankId);

//   return (
//     <div className="static flex justify-center">
//       <div className="w-full flex flex-wrap right-0 justify-around space-x-4 space-y-4 items-center lg:justify-between sm:justify-center md:justify-center">
//         {methods.map((ct) => (
//           <Link
//             key={ct.id}
//             href={`/method/${ct.id}`}
//             className="justify-center text-center"
//           >
//             <Card className="bg-slate-200 text-center flex w-96 flex-col">
//               <CardHeader>
//                 <CardTitle>{ct.type}</CardTitle>
//                 <CardDescription>Limite {ct.limits}</CardDescription>
//               </CardHeader>
//               <CardContent className="flex flex-col items-center justify-center">
//                 <p className="">{ct.information}</p>
//                 <Image
//                   className="rounded-sm h-48 w-48 object-cover object-center"
//                   src={ct?.symbol}
//                   alt={ct.type}
//                   width={400}
//                   height={400}
//                 />
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
