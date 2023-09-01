import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubCategories } from "../../utils/subCategory";

const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubCategories().then((res) => setSubCategories(res.data));
    setLoading(false);
  }, []);

  const showSubCategories = () =>
    subCategories.map((subCategory) => (
      <div
        key={subCategory._id}
        className="col btn btn-outlined-secondary shadow btn-lg btn-block m-3"
      >
        <Link to={`/subCategory/${subCategory.slug}`} > {subCategory.name}</Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center text-danger ">Loading...</h4>
        ) : (
          showSubCategories()
        )}
      </div>
    </div>
  );
};

export default SubCategoryList;
