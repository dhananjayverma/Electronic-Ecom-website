import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import StarRating from "react-star-ratings";

import laptopImage from "../../images/computer/laptop.png";
import ProductListItems from "./ProductListItems";
import { addToWishlist } from "../../utils/user";

import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../utils/rating";

import _ from "lodash"; //used for remove duplicates
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { TabPane } = Tabs;

//this is child component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
  const [tooltip, setTooltip] = useState("Click to add");

  //redux
  let { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  let history = useHistory()

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
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      console.log("Added to wishlist", res.data);
      toast.success("Added to wishlist")
      history.push('/user/wishlist')
    });
  };
  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((image) => (
                <img alt="#sss#" src={image.url} key={image.public_id} />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={
              <img alt="#sss#" src={laptopImage} className="mb-3 default-card-image" />
            }
          ></Card>
        )}

        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on xxxx xxx xx to larn more about this product
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-primary p-3">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}
        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a href="####" onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" />
                <br />
                Add to Cart
              </a>
            </Tooltip>,
            <a  href="####" onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" />
              <br /> Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectbale={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
