import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../utils/auth";

// for protecting the admin route
const AdminRoute = ({ children, ...restProps }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          // console.log("CURRENT ADMIN RES", res);
          setOk(true);
        })
        .catch((err) => {
          console.log("CURRENT ADMIN ERROR", err);
          setOk(false);
        });
    }
  }, [user]);

  return ok ? <Route {...restProps} /> : <LoadingToRedirect />;
};

export default AdminRoute;
