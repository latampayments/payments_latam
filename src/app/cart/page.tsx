'use Client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Layout, Table } from "lucide-react";

interface CartItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const itens:CartItem[] = [{
    id: 1,
    productName: 'Monthly package',
    quantity: 1,
    unitPrice: 100,
  }]

  setCartItems(itens)
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
    <Layout>
      <h1>Seu Carrinho</h1>
      <Table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Preço Total</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice}</td>
              <td>{item.quantity * item.unitPrice}</td>
              <td>
                <Button onClick={() => removeItemFromCart(item.id)}>
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Adicione o resumo do pedido e opções de pagamento aqui */}
      <Button onClick={() => router.push("/checkout")}>Finalizar Compra</Button>
    </Layout>
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
