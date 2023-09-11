"use client";
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
import CartProduct from "@/components/cart/stepProduct";
import SignUpForm from "@/components/form/SignUpForm";
import StepPayments from "@/components/cart/stepPayments";

interface CartItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

const CartPage = () => {
  //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const nextFormStep = () => setCurrentStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setCurrentStep((currentStep) => currentStep - 1);

  ////////////////////////////////////
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function handleInputChange(event: any) {
    const { name, value } = event.target;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  ////////////////////////////////////

  const steps = [
    {
      id: "CART",
      title: "Your Cart",
    },
    {
      id: "PESONAL",
      title: "SINGIN OR SINGUP",
    },
    {
      id: "PAYMENT",
      title: "Paymets",
    },
    {
      id: "LOGIN",
      title: "Login",
    },
  ];
  ////////////////////////////////////

  const cartItems: CartItem[] = [
    {
      id: 1,
      productName: "Monthly package",
      quantity: 1,
      unitPrice: 100,
    },
  ];
  console.log({ currentStep });
  console.log({ steps: steps[currentStep].id });
  console.log({ steps });
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your cart</CardTitle>
          <CardDescription>Itens in your cart</CardDescription>
        </CardHeader>

        {steps[currentStep].id === "CART" && (
          <CartProduct cartItems={cartItems} />
        )}
        {steps[currentStep].id === "PESONAL" && (
          <>
            <CardContent>
              <SignUpForm/>
            </CardContent>
          </>
        )}
        {steps[currentStep].id === "PAYMENT" && <StepPayments/>}
        {steps[currentStep].id === "LOGIN" && <Card>ENTRAR</Card>}

        <CardFooter>
          <div className="w-full flex flex-wrap items-center justify-between p-3">
            {currentStep < steps.length + 1 && (
              <Button className="m-3 "onClick={prevFormStep}>Back</Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button className="m-3 " onClick={nextFormStep}>Next</Button>
            )}

            {currentStep === steps.length - 1 && (
              <Button className="m-3 " onClick={()=>console.log("enviou")}>
                Enviar
              </Button>
            )}

          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default CartPage;
