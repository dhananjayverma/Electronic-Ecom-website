import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { LoadingOutlined } from "@ant-design/icons";

import { createProduct } from "../../../utils/product";
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
  categories: [],
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

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [showSubCategories, setShowSubCategories] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllCategories();
  }, []);

  const loadAllCategories = () => {
    getCategories().then((cat) => {
      console.log("dbhsjfh", cat);
      setValues({ ...values, categories: cat.data });
    });
  };

  const {
    title,
    description,
    price,
    categories,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createProduct(values, user.token)
      .then((res) => {
        setLoading(false);
        window.alert(`"${res.data.title}" is created`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        //   if(err.response.status===400) toast.error(err.response.data)
        toast.error(err.response.data.err);
      });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    console.log(name,value,"name,value")
    setValues({ ...values, [name]: value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subCategory: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setSubCategoryOption(res.data);
    });
    setShowSubCategories(true);
  };

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
            <h4 className="my-3">Product Create</h4>
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
              colors={colors}
              handleChange={handleChange}
            />
            <ProductSelectOption
              heading="Brand"
              brands={brands}
              handleChange={handleChange}
            />
            <ProductSelectOption
              heading="Category"
              value={category}
              categories={categories}
              handleChange={handleCategoryChange}
            />
            <MultiSelectOption
              heading="Sub Category"
              subCategory={subCategory}
              setValues={setValues}
              values={values}
              subCategoryOption={subCategoryOption}
              showSubCategories={showSubCategories}
            />
            <button className="btn btn-outline-info px-4 my-3">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProductCreate;
