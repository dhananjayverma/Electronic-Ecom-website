import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//importing ant icons
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../utils/category";

import AdminNav from "../../../component/nav/AdminNav";
import CategoryForm from "../../../component/forms/CategoryForm";
import LocalSearch from "../../../component/forms/LocalSearch";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  //searching amd filtering
  //step-1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => setName(e.target.value);

  //step-4 (HOF)
  const searched = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword);

  const loadCategories = () =>
    getCategories()
      .then((cat) => {
        setCategories(cat.data)
      })
      .catch((err) => console.log(err));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createCategory({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadCategories();
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

      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`"${res.data.name}" is deleted`);
          loadCategories();
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
    <CategoryForm btnName="Create" label="Name" {...restProps} />
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
            <h4>Create Category</h4>
          )}
          {createCategoryForm()}
          {/* step-2 and step-3 */}
          <LocalSearch
            keyword={keyword}
            filter="search category....."
            setKeyword={setKeyword}
          />
          {/* step-5 */}
          {categories.filter(searched(keyword)).map((category) => (
            <div className="alert alert-secondary" key={category._id}>
              {category.name}
              <span
                onClick={() => handleRemove(category.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${category.slug}`}>
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

export default CategoryCreate;
