import axios from "axios";

export const userCart = async (cart, authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart`,
    { cart },
    {
      headers: {
        authToken,
      },
    }
  );

export const getUserCart = async (authToken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authToken,
    },
  });

export const emptyUserCart = async (authToken) =>
  await axios.delete(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authToken,
    },
  });

export const saveUserAddress = async (authToken, address) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/address`,
    { address },
    {
      headers: {
        authToken,
      },
    }
  );

export const applyCoupon = async (authToken, coupon) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart/coupon`,
    { coupon },
    {
      headers: {
        authToken,
      },
    }
  );

export const createOrder = async (stripeResponse, authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    { stripeResponse },
    {
      headers: {
        authToken,
      },
    }
  );

export const getUserOrders = async (authToken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/orders`, {
    headers: {
      authToken,
    },
  });

export const getWishlist = async (authToken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
    headers: {
      authToken,
    },
  });
export const removeWishlist = async (productId, authToken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {},
    {
      headers: {
        authToken,
      },
    }
  );
export const addToWishlist = async (productId, authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: {
        authToken,
      },
    }
  );

export const createCashOrderForUser = async (authToken, COD, couponApplied) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cash-order`,
    { COD, couponApplied },
    {
      headers: {
        authToken,
      },
    }
  );
