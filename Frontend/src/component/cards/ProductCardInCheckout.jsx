import React from "react";
import ModalImage from "react-modal-image";
import laptopImage from "../../images/computer/laptop.png";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ prod }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  let dispatch = useDispatch();

  // handle color when user change the color by updating redux and local storage
  const handleColorChange = (e) => {
    console.log(e.target.value);
    let cart = [];
   
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      for(var i = 0 ;i<cart.length;i++){
        if(cart[i]._id===prod._id){
          cart[i].color=e.target.value
        }
      }
      // cart.map((product, ind) => {
      //   if (product._id === prod._id) {
      //     cart[ind].color = e.target.value;
      //   }
      //   return
      // });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    
  };

  //handle quantity when user change the quantity  by updating redux and local storage
  const handleQuantity = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value; //prevent to go below 1
    if (count > prod.quantity) {
      //prevent to exceed the limit of available quantity
      toast.error(`Max available quantity : ${prod.quantity}`);
      return;
    }
    let cart = [];
    
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      for(var i = 0 ;i<cart.length;i++){
        if(cart[i]._id===prod._id){
          cart[i].count=count
        }
      }
      // cart.map((product, ind) => {
      //   if (product._id === prod._id) {
      //      (cart[ind].count = count);
      //   }
      // });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    
  };

  const handleRemove = () => {
    // console.log(prod._id);
    let cart = [];
  
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // [1,2,3,4,5,6]
      for(var i = 0 ;i<cart.length;i++){
        if(cart[i]._id===prod._id){
          cart.splice(i,1)
        }
      }
      // cart.map((product, ind) => {
      //   if (product._id === prod._id) {
      //     cart.splice(ind, 1);
      //   }
      //   return
      // });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    
  };

  return (
    <tbody>
      <tr>
        {/* {JSON.stringify(prod)} */}
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {prod.images.length ? (
              <ModalImage
                small={prod.images[0].url}
                large={prod.images[0].url}
              />
            ) : (
              <ModalImage small={laptopImage} large={laptopImage} />
            )}
          </div>
        </td>
        <td>{prod.title}</td>
        <td>₹{prod.price}</td>
        <td>{prod.brand}</td>
        <td>
          <select
            name="color"
            onChange={handleColorChange}
            className="form-control bg-secondary text-white btn-sm"
            style={{
              border: "none",
              outline: "none",
              padding: "0px",
              height: "20px",
              width: "60px",
            }}
          >
            {prod.color ? (
              <option value={prod.color}>{prod.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((c) => c !== prod.color)
              .map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
          </select>
        </td>
        <td className="text-center">
          <input
            type="number"
            className="form-control bg-secondary text-white btn-sm "
            value={prod.count}
            onChange={handleQuantity}
            style={{
              border: "none",
              outline: "none",
              paddingRight: "3px",
              height: "20px",
              width: "40px",
            }}
          />
        </td>
        <td className="text-center">
          {prod.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className="text-center">
          <CloseOutlined
            onClick={handleRemove}
            className="text-danger pointer"
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
