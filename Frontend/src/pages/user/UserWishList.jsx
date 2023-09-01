import React, { useState, useEffect } from "react";
import UserNav from "../../component/nav/UserNav";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getWishlist, removeWishlist } from "../../utils/user";
import { DeleteOutlined } from "@ant-design/icons";

// import UserPanel from "./UserUtils";

const UserWishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const loadWishlist = () =>
    getWishlist(user.token).then((res) => {
      setWishlist(res.data.wishlist);
    });
    loadWishlist();
  }, [user.token]);

  const loadWishlist = () =>
    getWishlist(user.token).then((res) => {
      setWishlist(res.data.wishlist);
    });

  const handleRemove = (productId) =>
    removeWishlist(productId, user.token).then((res) => {
      loadWishlist();
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col-md-10">
            <h4 className="text-center m-3">Your wishlist</h4>
          {wishlist.map((prod) => (
            <div key={prod._id} className="alert alert-secondary">
              <Link to={`/product/${prod.slug}`} >{prod.title}</Link>
              <span
                onClick={() => handleRemove(prod._id)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  // <UserPanel UserNav={UserNav} pageText='User wishlist page'/>
};

export default UserWishList;
