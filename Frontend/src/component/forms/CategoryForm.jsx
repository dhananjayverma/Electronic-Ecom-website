import React from "react";

const CategoryForm = ({
  btnName,
  handleSubmit,
  label,
  name,
  handleChange,
  loading,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={handleChange}
        autoFocus
        required
      />
      <br />
      <button
        className="btn btn-outline-success btn-sm"
        disabled={!name || name.length < 2 || loading}
      >
        {btnName}
      </button>
    </div>
  </form>
);

export default CategoryForm;
