import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";

const Orders = ({ orders, handleStatusChange }) => {
   console.log("orders=======>",orders)
    const showOrderInTable = (order) => {
        return (
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                {/* <td scope="col">Title</td>
                <td scope="col">Price</td>
                <td scope="col">Brand</td>
                <td scope="col">Color</td>
                <td scope="col">Count</td>
                <td scope="col">Shipping</td> */}
                  <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">Brand</th>
                <th scope="col">Color</th>
                <th scope="col">Count</th>
                <th scope="col">Shipping</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((prod, ind) => (
                <tr key={ind}>
                  <td>
                    <b>{prod.product.title}</b>
                  </td>
                  <td>{prod.product.price}</td>
                  <td>{prod.product.brand}</td>
                  <td>{prod.color}</td>
                  <td>{prod.count}</td>
                  <td>
                    {prod.product.shipping === "Yes" ? (
                      <CheckCircleOutlined style={{ color: "green" }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: "red" }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      };
  return (
    <>
      {orders.map((order) => (
        <div key={order._id} className="row pb-5">
          <div className="btn btn-block bg-light ">
            <ShowPaymentInfo order={order} showStatus={false} />
            <div className="row">
              <div className="col-md-4">Delivery Status</div>
              <div className="col-md-8">
                <select
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="form-control bg-secondary text-white"
                  defaultValue={order.orderStatus}
                  name="status"
                >
                  <option value="Not Processed">Not Processed</option>
                  <option value="Cash On Delivery">Cash On Delivery</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          {showOrderInTable(order)}
        </div>
      ))}
    </>
  );
};

export default Orders;
