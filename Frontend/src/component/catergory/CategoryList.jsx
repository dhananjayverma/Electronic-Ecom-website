import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../utils/category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories().then((res) => setCategories(res.data));
    setLoading(false);
  }, []);

  const showCategories = () =>
    categories.map((category) => (
      <div
        key={category._id}
        className="col btn btn-outlined-secondary shadow btn-lg btn-block m-3"
      >
        <Link to={`/category/${category.slug}`} > {category.name}</Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center text-danger ">Loading...</h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
