import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../utils/product";

import ProductCard from "../cards/ProductCard";
import LoadingCardEffect from "../loadingEffect/loadingCardEffect";
import { Pagination } from "antd";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const loadAllProducts = () => {
      setLoading(true);
      getProducts("createdAt", "desc", page)
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log("home Page show products error --->", err.message);
        });
    };
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);



  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCardEffect count={3} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center py-3 mt-3">
          <Pagination
          size="small"
            current={page}
            total={Math.ceil(productsCount / 3) * 10}
            onChange={(value) => {
              setPage(value);
              console.log(value)
            }}
          />
        </nav>
      </div>
    </>
  );
};

export default NewArrivals;
