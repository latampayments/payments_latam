use client'
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
                {/*<Button onClick={() => removeItemFromCart(item.id)}>
                  Remover
          </Button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Adicione o resumo do pedido e opções de pagamento aqui */}
      {/*<Button onClick={() => router.push("/checkout")}>Finalizar Compra</Button>*/}
    </Layout>
  );
};
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
            <div className="w-full flex flex-wrap items-center justify-between ">
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
