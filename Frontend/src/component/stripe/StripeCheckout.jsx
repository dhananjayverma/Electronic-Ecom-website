import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//stripe
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../../utils/stripe";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import Laptop from "../../images/computer/laptop.png";
import { createOrder,emptyUserCart } from "../../utils/user";

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch();
  const { user, couponApplied } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, couponApplied).then((res) => {
      const { clientSecret, cartTotal, totalAfterDiscount, payable } = res.data;
      setClientSecret(clientSecret);
      //additional response recieved on successfull payment
      setCartTotal(cartTotal);
      setPayable(payable);
      setTotalAfterDiscount(totalAfterDiscount);
    });
  }, [couponApplied,user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here you get results after successful payment
      //create order and save in database for admin to process
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          //empty cart from local storage
           localStorage.removeItem("cart");
          //empty cart from redux
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          //reset coupon to false
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          //empty cart from database(mongodb)
          emptyUserCart(user.token);
        }
      });
      //empty user cart from redux store and local storage
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    // listen for changes in the card elements
    // and display any errors as the customer types their card details
    setDisabled(e.empty); // disabe pay button if errors
    setError(e.error ? e.error.message : ""); // to show error message if any
  };

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!succeeded && (
        <div>
          {couponApplied && totalAfterDiscount ? (
            <p className="alert alert-success">{`Total after discount: ₹${totalAfterDiscount}`}</p>
          ) : (
            <p className="alert alert-danger">No coupon applied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5 ">
        <Card
          cover={
            <img
               alt=""
              src={Laptop}
              style={{
                height: "150px",
                objectFit: "cover",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" />
              <br />
              Total : ₹{cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" />
              <br />
              Total Payable : ₹{(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>
      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <p className="text-center bg-light text-warning p-3">Use card No : 4242 4242 4242 4242 for testing puropse</p>
        <CardElement
          id="card-element"
          option={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error text-danger" role="alert">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Payment Successful{" "}
          <Link to="/user/history">See it in your purchase history</Link>{" "}
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
