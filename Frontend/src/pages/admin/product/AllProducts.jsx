
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import AdminNav from "../../../component/nav/AdminNav";
import { getProductsBYCount } from "../../../utils/product";
import AdminProductCard from "../../../component/cards/AdminProductCards";
import { removeProduct } from "../../../utils/product";

import { LoadingOutlined } from "@ant-design/icons";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsBYCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleRemove = (slug) => {
    setLoading(true);
    if (window.confirm("Are you sure want to delete?")) {
      removeProduct(slug, user.token)
        .then((res) => {
          const { title, brand } = res.data;
          toast.success(
            `Product with title "${title}" of brand "${brand}" is deleted.`
          );
          setLoading(false);
          loadAllProducts()
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
          setLoading(false);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col">
          {loading ? (
            <LoadingOutlined className="text-danger ml-5 h1" />
          ) : (
            <h4 className="m-3">All Products</h4>
          )}
          <hr style={{ color: "red" }} />
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 my-1">
                <AdminProductCard
                  product={product}
                  removeProduct={removeProduct}
                  handleRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

