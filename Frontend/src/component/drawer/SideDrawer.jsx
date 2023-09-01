import React from "react";
import { Drawer, Button } from "antd";
import { Link } from "react-router-dom";
import laptopImage from "../../images/computer/laptop.png";
import { useSelector, useDispatch } from "react-redux";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product`}
      placement="right"
      closable={false} //to not show the close icon
      visible={drawer}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
    >
      {/* {JSON.stringify(cart)} */}
      {cart.map((product) => (
        <div key={product._id} className="row">
          <div className="col">
            {product.images[0] ? (
              <>
                <img alt="fdsagfsg" src={product.images[0].url} style={imageStyle} />
                <p className="text-center bg-primary text-light mt-1">
                  {product.title} x {product.count}
                </p>
              </>
            ) : (
              <>
                <img  alt="fdsagfsg" src={laptopImage} style={imageStyle} />
                <p className="text-center bg-primary text-light">
                  {product.title} x {product.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}

      <Link to="/cart">
        <Button
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-block bg-success text-light mt-5 "
        >
          Go To Cart
        </Button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
