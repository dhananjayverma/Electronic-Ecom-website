// require('react-quill/dist/quill.snow.css');
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../utils/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState("");
  const [coupon, setCoupon] = useState("");
  // discounted price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  // if coupon is not valid
  const [discountError, setDiscountError] = useState("");

  const { user, COD,couponApplied } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);

  const emptyCart = () => {
    //remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    //remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    //remove from mongodb(backend)
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("cart is empty. Continue shopping");
    });
  };

  const saveAddressToDb = () => {
    // console.log(address)
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address Saved");
      }
    });
  };

  const applyDiscountCoupon = () => {
    applyCoupon(user.token, coupon).then((res) => {
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true/false
        dispatch({ type: "COUPON_APPLIED", payload: true });
      }
      //error
      if (res.data.err) {
        setDiscountError(res.data.err);
        console.log("not applied");
        //update redux coupon applied
        dispatch({ type: "COUPON_APPLIED", payload: false });
      }
    });
  };

  const showAddress = () => (
    <>
      {/* little bit change in onchange for react quill */}
      <ReactQuill
        theme="snow"
        value={address}
        onChange={setAddress}
        className="m-1"
      />{" "}
      <button className="btn btn-primary btn-sm  m-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((prod, ind) => (
      <div key={ind}>
        <p>
          {prod.product.title} ({prod.color}) x {prod.count} = ₹
          {prod.product.price * prod.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        type="text"
        className="form-control m-1"
        value={coupon}
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
      />
      <button
        className="btn btn-primary btn-sm m-2"
        onClick={applyDiscountCoupon}
      >
        Apply
      </button>
    </>
  );

  const createCashOrder =() => (
    createCashOrderForUser(user.token, COD,couponApplied).then(res=>{
      console.log("User cash order created",res)
      //empty cart from redux, local storage, reset Coupon,reset COD,redirect
      if(res.data.ok){
        //empty local storage
    localStorage.removeItem('cart')
        //empty redux cart
        dispatch({
          type:'ADD_TO_CART',
          payload:[],
        });
        //empty redux coupon
        dispatch({
          type:'COUPON_APPLIED',
          payload:false,
        });
        //empty redux cod
        dispatch({
          type:'COD',
          payload:false,
        });
        //empty cart from backend
        emptyUserCart(user.token)

        //redirect
        setTimeout(()=>{
          history.push('/user/history')
        },1000)
      }
    })
  )

  return (
    <div className="row">
      <div className="col-md-6 ">
        <br />
        <h4>Delivery Address</h4>
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        {showApplyCoupon()}
        {discountError && <p className="bg-danger h6 p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <br />
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: ₹{total}</p>
        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2 h6">
            Discount Applied: Total Payable: ₹{totalAfterDiscount}
          </p>
        )}
        <hr />
        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary btn-sm  m-1"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm  m-1"
                disabled={!addressSaved || !products.length}
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
             )} 
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-primary btn-sm  m-1"
              disabled={!products.length}
              onClick={emptyCart}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
