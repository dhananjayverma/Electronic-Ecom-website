import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//importing ant icons
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  createSubCategory,
  getSubCategories,
  removeSubCategory,
} from "../../../utils/subCategory";
import { getCategories } from "../../../utils/category";

import AdminNav from "../../../component/nav/AdminNav";
import CategoryForm from "../../../component/forms/CategoryForm";
import LocalSearch from "../../../component/forms/LocalSearch";

const SubCategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  //searching amd filtering
  //step-1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const handleChange = (e) => setName(e.target.value);

  //step-4 (HOF)
  const searched = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword);

  const loadCategories = () =>
    getCategories()
      .then((cat) => setCategories(cat.data))
      .catch((err) => console.log(err));

  const loadSubCategories = () =>
    getSubCategories()
      .then((sub) => setSubCategories(sub.data))
      .catch((err) => console.log(err));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createSubCategory({ name, parent: parentCategory }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadSubCategories()
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Delete?")) {
      setLoading(true);

      removeSubCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`"${res.data.name}" is deleted`);
          loadSubCategories()
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          if (err.response.status === 400) toast.error(err.response.data);
        });
    }
  };

  const restProps = { handleSubmit, name, handleChange, loading };

  const createCategoryForm = () => (
    <CategoryForm btnName="Create" label="Sub-category Name" {...restProps} />
  );

  const parentCategorySelectionForm = () => (
    <div className="form-group">
      <label>Parent Category</label>
      <select
        name="category"
        placeholder="select category"
        className="form-control bg-secondary text-white"
        onChange={(e) => setParentCategory(e.target.value)}
      >
        <option className="bg-secondary text-white">Please Select</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option
              className="bg-secondary text-white"
              key={category._id}
              value={category._id}
              name={name}
            >
              {category.name}
            </option>
          ))}
      </select>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create Sub-category</h4>
          )}
          {parentCategorySelectionForm()}
          {createCategoryForm()}
          {/* step-2 and step-3 */}
          <LocalSearch
            keyword={keyword}
            filter="search category....."
            setKeyword={setKeyword}
          />
          {/* step-5 */}
          {subCategories.filter(searched(keyword)).map((sub) => (
            <div className="alert alert-secondary" key={sub._id}>
              {sub.name}
              <span
                onClick={() => handleRemove(sub.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/subCategory/${sub.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-primary" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryCreate;
