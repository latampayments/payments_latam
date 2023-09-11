
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";

// This value is from the props in the UI
const style = {layout: "vertical"};

async function createOrder() {
  // replace this url with your server
  const response = await fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // use the "body" param to optionally pass additional order information
    // like product ids and quantities
    body: JSON.stringify({
      cart: [
        {
          sku: "1blwyeo8",
          quantity: 2,
        },
      ],
    }),
  });
  const order = await response.json();
  return order.id;
}
async function onApprove(data:any) {
  // replace this url with your server
  const response = await fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderID: data.orderID,
    }),
  });
  const orderData = await response.json();
}

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ showSpinner }:any) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
      <>
          { (showSpinner && isPending) && <div className="spinner" /> }
          <PayPalButtons
              style={{layout: "vertical"}}
              disabled={false}
              forceReRender={[style]}
              fundingSource={undefined}
              createOrder={createOrder}
              onApprove={onApprove}
          />
      </>
  );
}

export default function PaypalMethod() {
  return (
      <div style={{ maxWidth: "750px", minHeight: "200px" }}>
          <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
              <ButtonWrapper showSpinner={false} />
          </PayPalScriptProvider>
      </div>
  );
}