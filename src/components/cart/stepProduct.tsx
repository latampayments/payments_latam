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

const CartProduct = (props: any) => {
  //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartItems: CartItem[] = props.cartItems;
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
                <TableCell className="font-medium">
                  {item.productName}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">${item.unitPrice}</TableCell>
                <TableCell className="text-right">
                  ${item.quantity * item.unitPrice}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
};

export default CartProduct;
