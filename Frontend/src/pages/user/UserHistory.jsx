import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import UserNav from "../../component/nav/UserNav";
// import UserPanel from "./UserUtils";
import { getUserOrders } from "../../utils/user";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import { toast } from "react-toastify";
import ShowPaymentInfo from "../../component/cards/ShowPaymentInfo";

const UserHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const loadUserOrders = () =>
    getUserOrders(user.token).then((res) => {
      // console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });
    loadUserOrders();
  }, [user.token]);

  // const loadUserOrders = () =>
  //   getUserOrders(user.token).then((res) => {
  //     // console.log(JSON.stringify(res.data, null, 4));
  //     setOrders(res.data);
  //   });

  //dispaying orders

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

  const showEachOrders = () =>
    orders.reverse().map((order, ind) => {
      return (
        <div key={ind} className="m-5 p-3 card">
          {/* {JSON.stringify(order)} */}
          <ShowPaymentInfo order={order} />
          {showOrderInTable(order)}
        </div>
      );
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4 className="mt-3">
            {orders.length ? "User Purchase orders" : "No purchse orders"}
          </h4>
          {showEachOrders()}
        </div>
      </div>
    </div>
  );
};

export default UserHistory;
