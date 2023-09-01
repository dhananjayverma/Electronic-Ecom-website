import React from "react";
import { Link } from "react-router-dom";

const ProductListItems = ({ product }) => {
  const {
    price,
    category,
    subCategory,
    sold,
    shipping,
    color,
    brand,
    quantity,
  } = product;
  return (
    <>
      <ul className="list-group">
        <li className="list-group-item border-0">
          Price <span className="float-right">₹{price}</span>
        </li>
        {category && (
          <li className="list-group-item border-0">
            Category{" "}
            <Link to={`/category/${category.slug}`} className="float-right">
              {category.name}
            </Link>
          </li>
        )}
        {subCategory && (
          <li className="list-group-item border-0">
            Sub Category{" "}
            {subCategory.map((el) => (
              <Link
                key={el._id}
                to={`/subCategory/${el.slug}`}
                className="float-right ml-5"
              >
                {el.name}
              </Link>
            ))}
          </li>
        )}
        <li className="list-group-item border-0">
          Color <span className="float-right">{color}</span>
        </li>
        <li className="list-group-item border-0">
          Brand <span className="float-right">{brand}</span>
        </li>
        <li className="list-group-item border-0">
          Quantity <span className="float-right">{quantity}</span>
        </li>
        <li className="list-group-item border-0">
          Sold <span className="float-right">{sold}</span>
        </li>
        <li className="list-group-item border-0">
          Shipping <span className="float-right">{shipping}</span>
        </li>
      </ul>
    </>
  );
};

export default ProductListItems;
