import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (product) => {
  if (product && product.ratings) {
    let ratingsArray = product.ratings;
    let total = [];
    ratingsArray.map((rating) => total.push(rating.star));
    let totalRatingsValue = total.reduce((prev, next) => prev + next, 0);
    let avgRating = totalRatingsValue / ratingsArray.length;
    // console.log("taotal", total, "totalRatingValue--->", totalRatingsValue);
    // console.log("avgRating-->", avgRating);

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            rating={avgRating}
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="red"
            editing={false}
          />{"   "}
          ({product.ratings.length})
        </span>
      </div>
    );
  }
};
