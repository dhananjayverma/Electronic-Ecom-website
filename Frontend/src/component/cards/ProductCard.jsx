import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptopImage from "../../images/computer/laptop.png";
import { Link } from "react-router-dom";

import { showAverage } from "../../utils/rating";
import _ from "lodash"; //used for remove duplicates
import { useDispatch } from "react-redux";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { images, slug, title, description, price } = product;
  const [tooltip, setTooltip] = useState("Click to add");

  //redux
  // const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    //create cart array
    let cart = [];
    if (typeof window != "undefined") {
      // if cart is in localstorage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      //push new product to cart
      cart.push({
        ...product,
        count: 1,
      });

      //remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);

      //save to local storage
      localStorage.setItem("cart", JSON.stringify(unique));

      // show tooltip
      setTooltip("Added");

      //add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });

      //show cart items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No rating yet</div>
      )}
      <Card
        hoverable
        cover={
          <img
            alt="example"
            src={images && images.length ? images[0].url : laptopImage}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-primary" />
            <br />
            View Product
          </Link>,
          <Tooltip
            title={product.quantity < 1 ? "Out of stock" : tooltip}
            disabled={product.quantity < 1?true:false}
          >
            <a href="#####" onClick={handleAddToCart} disabled={product.quantity===0}>
              <ShoppingCartOutlined className="text-danger" />
              <br />
              {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - ₹${price}`}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
