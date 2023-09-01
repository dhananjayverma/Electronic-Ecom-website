
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { LoadingOutlined } from "@ant-design/icons";

import { getProduct, updateProduct } from "../../../utils/product";
import { getCategories, getCategorySubs } from "../../../utils/category";

import AdminNav from "../../../component/nav/AdminNav";
import ProductInput from "../../../component/inputField/productInput";
import ProductSelectOption from "../../../component/selectOption/productSelectOption";
import MultiSelectOption from "../../../component/multiSelectOption/productMultiSelectOption";
import FileUplaod from "../../../component/imageUpload/imageUpload";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subCategory: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "HP"],
  color: "",
  brand: "",
};

const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [showSubCategories, setShowSubCategories] = useState(true);
  const [subCategoryArray, setSubCategoryArray] = useState([]);
  const [prePopulateSelectShipping, setPrePopulateSelectShipping] =
    useState(true);

  const prevCategory = useRef("");

  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;

  const {
    title,
    description,
    price,
    category,
    subCategory,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(slug).then((res) => {
      //1 load single product
      setValues({ ...values, ...res.data });
      prevCategory.current = res.data.category._id;

      //2 load single product sub category
      getCategorySubs(res.data.category._id).then((res) => {
        setSubCategoryOption(res.data); //on first load ,show default sub category
      });
      //3 prepare array of subCategory ids to show as dfefault sub values in ant design select
      const subCategoryIdArray = [];
      res.data.subCategory.map((subCat) => subCategoryIdArray.push(subCat._id));
      setSubCategoryArray((prev) => subCategoryIdArray); //requires for ant design select to work
    });
  };

  const loadCategories = () => {
    getCategories(category)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    values.subCategory = subCategoryArray;
    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${res.data.title}" is updated`);
        history.push("/admin/products");
      })
      .catch((err) => {
        console.log("Error in upadation--->", err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subCategory: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setSubCategoryOption(res.data);
    });
    //to load the default subCategory when clicked back on existing category
    if (prevCategory.current=== e.target.value) {
      loadProduct();
    }
    //to clear out the subcategory if othrt category is selected other than existing one
    setSubCategoryArray([]);

  };

  //productSelectOptionForm

  const ProductSelectOptionForm = () => (
    <div className="form-group">
      <label>Category</label>

      <select
        name="category"
        className="form-control bg-secondary text-white"
        value={category._id}
        onChange={handleCategoryChange}
      >
        {/* <option className="bg-secondary text-white">
          {category ? category.name : "Select Category"}
        </option> */}
        {categories.length > 0 &&
          categories.map((el) => (
            <option
              className="bg-secondary text-white"
              value={el._id}
              key={el._id}
            >
              {el.name}
            </option>
          ))}
      </select>
    </div>
  );

  const selectShipping = ["No", "Yes"];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger m-3 h1" />
          ) : (
            <h4 className="my-3">Product Update</h4>
          )}

          <hr />
          <div className="p-3">
            <FileUplaod
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <ProductInput
              heading="Title"
              type="text"
              value={title}
              handleChange={handleChange}
            />
            <ProductInput
              heading="Description"
              type="text"
              value={description}
              handleChange={handleChange}
            />
            <ProductInput
              heading="Price"
              type="number"
              value={price}
              handleChange={handleChange}
            />
            <ProductSelectOption
              heading="Shipping"
              selectShipping={selectShipping}
              shipping={shipping}
              handleChange={handleChange}
            />
            <ProductInput
              heading="Quantity"
              type="number"
              value={quantity}
              handleChange={handleChange}
            />
            <ProductSelectOption
              heading="Color"
              color={color}
              colors={colors}
              handleChange={handleChange}
            />
            <ProductSelectOption
              heading="Brand"
              brand={brand}
              brands={brands}
              handleChange={handleChange}
            />
            {/* <ProductSelectOption
              heading="Category"
              brand={brand}
              categoryName={category.name}
              categoryId={category._id}
              categories={categories}
              handleChange={handleCategoryChange}
            /> */}
            {ProductSelectOptionForm()}
            <MultiSelectOption
              heading="Sub Category"
              values={values}
              setValues={setValues}
              showSubCategories={showSubCategories}
              subCategoryOption={subCategoryOption}
              subCategoryArray={subCategoryArray}
              setSubCategoryArray={setSubCategoryArray}
            />
            <button className="btn btn-outline-info px-4 my-3">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProductUpdate;
