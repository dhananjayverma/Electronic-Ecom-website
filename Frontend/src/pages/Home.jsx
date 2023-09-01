import React from "react";

import TypeWriterEffect from "../component/typewriter/TypeWriterEffect";
import NewArrivals from "../component/home/NewArrivals";
import BestSellers from "../component/home/BestSellers";
import CategoryList from "../component/catergory/CategoryList";
import SubCategoryList from "../component/subCategory/subCategoryList";

const Home = () => {
  return (
    <>
      <div className="jumbotron text-danger h1 font-weight-bold text-center">
        <TypeWriterEffect
          text={["Latest Products", "New Arrivals", "Best Sellers"]}
        />
      </div>
      <h4 className="text-center p-3 my-5 display-5 jumbotron">New Arrivals</h4>
      <NewArrivals />
      <h4 className="text-center p-3 my-5 display-5 jumbotron">Best Sellers</h4>
      <BestSellers />
      <h4 className="text-center p-3 my-5 display-5 jumbotron">Categories</h4>
      <CategoryList />
      <h4 className="text-center p-3 my-5 display-5 jumbotron">Sub Categories</h4>
      <SubCategoryList />
      <br />
      <br />
    </>
  );
};

export default Home;
