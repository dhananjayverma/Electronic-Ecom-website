import React, { useEffect, useState } from "react";
import AdminNav from "../../component/nav/AdminNav";
import { getOrders, changeStatus } from "../../utils/admin";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Orders from "../../component/order/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));



  useEffect(() => {
    const loadOrders = () =>
    getOrders(user.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });
    loadOrders();
  }, [user.token]);

  const loadOrders = () =>
  getOrders(user.token).then((res) => {
    console.log(JSON.stringify(res.data, null, 4));
    setOrders(res.data);
  });

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      toast.success("Staus updated");

      loadOrders();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h4>Admin Dashboard</h4>
          {/* {JSON.stringify(orders)} */}
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
