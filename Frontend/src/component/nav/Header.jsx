import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { auth } from "../../firebase/firbase";
import { useDispatch, useSelector } from "react-redux";
import Search from "../forms/search";

const { SubMenu } = Menu;

const menuItemStyle = {
  marginLeft:"auto"
}

const Header = () => {
  const [current, setCurrent] = useState("home");
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, cart } = useSelector((state) => ({ ...state }));

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logOut = () => {
    auth.signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Menu.Item>
      <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Menu.Item>
      <Menu.Item style={menuItemStyle}>
        <Search />
      </Menu.Item>

      {!user && (
        <Menu.Item
          key="register"
          icon={<UserAddOutlined />}
          // className="float-right"
          // style={menuItemStyle}
        >
          <Link to="/register">Register</Link>
        </Menu.Item>
      )}
      {!user && (
        <Menu.Item key="login" icon={<UserOutlined />} 
        >
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
      {user && (
        <SubMenu
          key="username"
          icon={<SettingOutlined />}
          title={user.email.split("@")[0]}
        >
          {user && user.role === "admin" && (
            <Menu.Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>
          )}
          {user && user.role === "subscriber" && (
            <Menu.Item>
              <Link to="/user/history">Dashboard</Link>
            </Menu.Item>
          )}

          <Menu.Item onClick={logOut} icon={<LogoutOutlined />}>
            LogOut
          </Menu.Item>
        </SubMenu>
      )}
      
    </Menu>
  );
};

export default Header;
