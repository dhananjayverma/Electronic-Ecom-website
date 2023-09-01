import React from "react";
import { Card, Skeleton } from "antd";

const LoadingCardEffect = ({ count }) => {
  const cards = () => {
    let totalCards = [];
    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Card key={i} className="col m-3">
          <Skeleton active></Skeleton>
        </Card>
      );
    }
    return totalCards;
  };

  return <div className="row pb-5">{cards()}</div>;
};

export default LoadingCardEffect;
