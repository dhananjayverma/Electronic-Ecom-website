import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

// for protecting the user route
const UserRoute = ({ children, ...restProps }) => {
  const { user } = useSelector((state) => ({ ...state }));

  return user && user.token ? (
    <Route {...restProps} />
  ) : (
    <LoadingToRedirect/>
  );
};

export default UserRoute;
