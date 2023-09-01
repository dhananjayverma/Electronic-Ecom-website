import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../component/cards/ProductCard";

import { getProduct, productStar, getRelated } from "../utils/product";
import SingleProduct from "../component/cards/SingleProduct";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState({});

  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;

  useEffect(() => {
    const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      //load realated
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });
  };
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  },[product.ratings,user]);

  
  const onStarClick = (newRating, name) => {
    setStar(newRating);
    console.log(newRating, name);
    productStar(name, newRating, user.token)
      .then((res) => {
        console.log("rating clicked", res.data);
        const loadSingleProduct = () => {
          getProduct(slug).then((res) => {
            setProduct(res.data);
            //load realated
            getRelated(res.data._id).then((res) => setRelated(res.data));
          });
        };
        loadSingleProduct();
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row pt-4">
          <SingleProduct
            product={product}
            onStarClick={onStarClick}
            star={star}
          />
        </div>
        <div className="row">
          <div className="col text-center pt-5 pb-2">
            <hr />
            <h4>Related Products</h4>
            <hr />
          </div>
        </div>
        <div className="row pb-5">
          {related.length ? (
            related.map((r) => (
              <div key={r._id} className="col-md-4">
                <ProductCard product={r} />
              </div>
            ))
          ) : (
            <div className="text-center col ">No product found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
