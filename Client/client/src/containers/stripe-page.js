import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ClassPage from "../Components-user/ClassPage";

// Load stripe with your public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Stripe = (props) => {
  return (
    <Elements stripe={stripePromise}>
      {/* Wrap your components/routes that use Stripe here */}
      <ClassPage {...props} />
    </Elements>
  );
};
export default Stripe;
