import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { getCategory, updateCategory } from "../../../utils/category";

import AdminNav from "../../../component/nav/AdminNav";
import CategoryForm from "../../../component/forms/CategoryForm";

const CategoryUpdate = ({ history, match }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const previousCategory = useRef("");

  const { user } = useSelector((state) => ({ ...state }));
  const { slug } = match.params;

  useEffect(() => {
    const loadCategory = () =>
    getCategory(slug)
      .then((cat) => {
        setName(cat.data.category.name);
        previousCategory.current = cat.data.category.name;
      })
      .catch((err) => console.log(err));

    loadCategory();
  }, [slug]);

  const handleChange = (e) => setName(e.target.value);

  // const loadCategory = () =>
  //   getCategory(slug)
  //     .then((cat) => {
  //       setName(cat.data.category.name);
  //       previousCategory.current = cat.data.category.name;
  //     })
  //     .catch((err) => console.log(err));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateCategory(slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(
          `"${previousCategory.current}" is updated to "${res.data.name}"`
        );
        history.push("/admin/category");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const restProps = { handleSubmit, name, handleChange, loading };

  const createCategoryForm = () => (
    <CategoryForm btnName="Update" label="Name" {...restProps} />
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
            <h4>Update Category </h4>
          )}
          {createCategoryForm()}
          <br />
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
