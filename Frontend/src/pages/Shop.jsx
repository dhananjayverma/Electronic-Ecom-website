import React, { useEffect, useState } from "react";
import { getProductsBYCount, fetchProductsByFilter } from "../utils/product";
import { getCategories } from "../utils/category";
import { getSubCategories } from "../utils/subCategory";
import ProductCard from "../component/cards/ProductCard";
import Star from "../component/star/Star";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { SubMenu} = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]); //to show categories options in the search/filter sidebar
  const [categoryIds, setCategoryIds] = useState([]);
  const [, setStar] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [, setSubCategory] = useState([]);
  const [brands,] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
    "HP",
  ]);
  const [brand, setBrand] = useState("");
  const [colors,] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    //fetch categories
    getCategories().then((res) => setCategories(res.data));
    //fetch subCategories
    getSubCategories().then((res) => setSubCategories(res.data));
  }, []);

  // 1 Load products by deafault on page load
  const loadAllProducts = () => {
    getProductsBYCount(12).then((p) => {
      setProducts(p.data);
    });
  };

  //2 Load page on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchFilterdProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  const fetchFilterdProducts = (arg) => {
    setLoading(true)
    fetchProductsByFilter(arg).then((res) => {
      setLoading(false)
      console.log(res);
      setProducts(res.data);
    });
  };

  //3 Load products based on price range
  useEffect(() => {
    fetchFilterdProducts({ price });
  }, [ok,price]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping("");
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  //4 Load products based on categories
  //show categories in a list of checkbox
  const showCategories = () =>
    categories.map((category) => (
      <div key={category._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 px-4"
          value={category._id}
          name="category"
          checked={categoryIds.includes(category._id)}
        >
          {category.name}
        </Checkbox>
      </div>
    ));

  //handle chevk for categories
  const handleCheck = (e) => {
    //  console.log(e.target.value)
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping("");
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); //index or -1

    //indexOf method ?? if not found return -1 else return index
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      //if found pull out the one item from index
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    console.log(inTheState, "inThesatye.......");
    fetchFilterdProducts({ category: inTheState });
  };

  // 5. show Product by star ratings
  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand("");
    setColor("");
    setShipping("");
    setStar(num);
    fetchFilterdProducts({ stars: num });
  };

  const showStars = () => {
    return (
      <div className="px-4 pb-2">
        <Star starClick={handleStarClick} numberOfStars={5} />
        <Star starClick={handleStarClick} numberOfStars={4} />
        <Star starClick={handleStarClick} numberOfStars={3} />
        <Star starClick={handleStarClick} numberOfStars={2} />
        <Star starClick={handleStarClick} numberOfStars={1} />
      </div>
    );
  };

  // 6. show product by subCategories
  const showSubCategories = () =>
    subCategories.map((sub) => (
      <div
        key={sub._id}
        onClick={() => handleSubmit(sub._id)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {sub.name}
      </div>
    ));

  const handleSubmit = (subCategory) => {
    setSubCategory(subCategory);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping("");
    fetchFilterdProducts({ subCategory });
  };

  // 7. show products by brands
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pl-4 pb-1 pr-5"
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    setSubCategory("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setColor("");
    setShipping("");
    setBrand(e.target.value);
    fetchFilterdProducts({ brand: e.target.value });
  };

  // 8. show products by colors
  const showColors = () =>
    colors.map((col) => (
      <Radio
        key={col}
        value={col}
        name={col}
        checked={col === color}
        onChange={handleColor}
        className="pl-4 pb-1 pr-5"
      >
        {col}
      </Radio>
    ));

  const handleColor = (e) => {
    setSubCategory("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setShipping("");
    setColor(e.target.value);
    fetchFilterdProducts({ color: e.target.value });
  };

  // 9. show products based on shipping
  const showShipping = () => (
    <>
      <Checkbox
        className=" mx-4 py-1"
        onChange={handleShipping}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>
      <Checkbox
        className="mx-4 py-1"
        onChange={handleShipping}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  //handle shipping
  const handleShipping = (e) => {
    setSubCategory("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchFilterdProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />
          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
          >
            {/* for price */}
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `₹${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="199999"
                />
              </div>
            </SubMenu>
            {/* categories */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div>{showCategories()}</div>
            </SubMenu>
            {/* star */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>
            {/* subCategories */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Sub-Categories
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-4 pr-4">
                {showSubCategories()}
              </div>
            </SubMenu>
            {/* Brands */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Brands
                </span>
              }
            >
              <div
                style={{
                  marginTop: "-10px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {showBrands()}
              </div>
            </SubMenu>
            {/* Colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Colors
                </span>
              }
            >
              <div
                style={{
                  marginTop: "-10px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {showColors()}
              </div>
            </SubMenu>
            {/* Shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Shipping
                </span>
              }
            >
              <div
                style={{
                  marginTop: "-10px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  padding: "8px 0px",
                }}
              >
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p>No products found</p>}
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 my-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
