import React from "react";

const LocalSearch = ({ keyword, filter,setKeyword }) => {
  const handleSearchChange = (e) => setKeyword(e.target.value.toLowerCase());

  return (
    <input
      type="search"
      placeholder={filter}
      value={keyword}
      onChange={handleSearchChange}
      className="form-control mb-4"
    />
  );
};

export default LocalSearch;
