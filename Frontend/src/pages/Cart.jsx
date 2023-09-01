import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "../component/cards/ProductCardInCheckout";
import { userCart } from "../utils/user";

const Cart = ({ history }) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    // console.log("cart", JSON.stringify(cart, null, 4));
    userCart(cart, user.token)
      .then((res) => {
        console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save error", err));
  };

  //saveCashOrderToDb
  const saveCashOrderToDb = () => {
    // console.log("cart", JSON.stringify(cart, null, 4));
    dispatch({
      type: "COD",
      payload: true,
    });
    userCart(cart, user.token)
      .then((res) => {
        console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save error", err));
  };

  const showCartItems = () => {
    return (
      <>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">Price</th>
              <th scope="col">Brand</th>
              <th scope="col">Color</th>
              <th scope="col">Count</th>
              <th scope="col">Shipping</th>
              <th scope="col">Remove</th>
            </tr>
          </thead>
          {/* {JSON.stringify(cart)} */}
          {cart.map((el) => {
            return <ProductCardInCheckout key={el._id} prod={el} />;
          })}
        </table>
      </>
    );
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Product</h4>
          {!cart.length ? (
            <p>
              {" "}
              No Products in cart. <Link to="/shop">
                Continue Shopping
              </Link>{" "}
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          {cart.map((c, ind) => (
            <div key={ind}>
              <p>
                {" "}
                <span className="text-danger">{c.title}</span> x {c.count} = ₹
                {c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total : <b>₹{getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                onClick={saveOrderToDb}
                className="btn btn-sm btn-primary mt-2 "
                style={{ border: "none", marginBottom: "10" }}
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                onClick={saveCashOrderToDb}
                className="btn btn-sm btn-danger mt-2 "
                style={{ border: "none", marginBottom: "10" }}
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary mt-1 "
              style={{ border: "none" }}
            >
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "cart" },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
