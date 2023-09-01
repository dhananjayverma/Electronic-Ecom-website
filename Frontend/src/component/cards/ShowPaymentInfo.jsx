import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
    console.log("order=====>",order)
 return <div>
    {/* {JSON.stringify(order,null,4)} */}
    <p>
      <span>Order Id: {order.paymentIntent.id},</span>{" "}
      <span>
        Amount:{" "}
        {(order.paymentIntent.amount /= 100).toLocaleString()},
      </span>{" "}
      <span>
        Currency: {order.paymentIntent.currency.toUpperCase()},
      </span>{" "}
      <span>
        Method: {order.paymentIntent.payment_method_types[0]},
      </span>{" "}
      <span>
        Payment: {order.paymentIntent.status.toUpperCase()},
      </span>{" "}
      <span>
        Ordered on :{" "}
        {new Date(
          order.paymentIntent.created * 1000
        ).toLocaleString()}
        ,
      </span>{" "}
      <br />
      {showStatus && (
        <span className="badge bg-primary text-white">
          STATUS : {order.orderStatus}
        </span>
      )}
    </p>
  </div>
};

export default ShowPaymentInfo;
