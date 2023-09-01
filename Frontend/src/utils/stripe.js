import axios from "axios";

export const createPaymentIntent = (authToken,couponApplied) =>
  axios.post(
    `${process.env.REACT_APP_API}/create-payment-intent`,
    {couponApplied},
    {
      headers: {
        authToken,
      },
    }
  );
