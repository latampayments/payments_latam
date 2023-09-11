"use Client";
import React, { useState } from "react";

import {

  CardContent,

} from "@/components/ui/card";
import PaypalMethod from "./method_payments/paypal";

const StepPayments = (props: any) => {
  //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <>
      <CardContent>
        <PaypalMethod/>
      </CardContent>
    </>
  );
};

export default StepPayments;
