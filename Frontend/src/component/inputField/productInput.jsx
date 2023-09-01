import React from "react";

const ProductInput = ({ heading, handleChange, value, type }) => (
  <div className="form-group">
    <label>{heading}</label>
    <input
      type={type}
      name={heading.toLowerCase()}
      className="form-control"
      value={value}
      onChange={handleChange}
      autoFocus={heading === "Title"}
    />
  </div>
);

export default ProductInput;
