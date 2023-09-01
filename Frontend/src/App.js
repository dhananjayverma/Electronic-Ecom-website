import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase/firbase";
import "../src/index.css";
import { LoadingOutlined } from "@ant-design/icons";

//utils import
import { currentUser } from "../src/utils/auth";

// import Home from "./pages/Home";
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";
// import Header from "./component/nav/Header";
// import SideDrawer from "./component/drawer/SideDrawer";

// import RegisterComplete from "./pages/auth/RegisterComplete";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import UserHistory from "./pages/user/UserHistory";
// import UserRoute from "./component/routes/UserRoute";
// import AdminRoute from "./component/routes/AdminRoute";
// import UserPassword from "./pages/user/UserPassword";
// import UserWishList from "./pages/user/UserWishList";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import CategoryCreate from "./pages/admin/category/CategoryCreate";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
// import SubCategoryCreate from "./pages/admin/subCategory/SubCategoryCreate";
// import SubCategoryUpdate from "./pages/admin/subCategory/SubCategoryUpdate";
// import ProductCreate from "./pages/admin/product/ProductCreate";
// import AllProducts from "./pages/admin/product/AllProducts";
// import ProductUpdate from "./pages/admin/product/ProductUpdate";
// import Product from "./pages/Product";
// import CategoryHome from "./pages/category/CategoryHome";
// import SubCategoryHome from "./pages/subCategory/SubCategoryHome";
// import Shop from "./pages/Shop";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import CreateCouponPage from "./pages/admin/coupon/CreateCoupon";
// import Payment from "./pages/Payement";



//lasy and suspence

const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Header = lazy(() => import("./component/nav/Header"));
const SideDrawer = lazy(() => import("./component/drawer/SideDrawer"));

const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const UserHistory = lazy(() => import("./pages/user/UserHistory"));
const UserRoute = lazy(() => import("./component/routes/UserRoute"));
const AdminRoute = lazy(() => import("./component/routes/AdminRoute"));
const UserPassword = lazy(() => import("./pages/user/UserPassword"));
const UserWishList = lazy(() => import("./pages/user/UserWishList"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubCategoryCreate = lazy(() =>
  import("./pages/admin/subCategory/SubCategoryCreate")
);
const SubCategoryUpdate = lazy(() =>
  import("./pages/admin/subCategory/SubCategoryUpdate")
);
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubCategoryHome = lazy(() =>
  import("./pages/subCategory/SubCategoryHome")
);
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCoupon")
);
const Payment = lazy(() => import("./pages/Payement"));



function App() {
  const dispatch = useDispatch();
  //to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token) //frotend is sending token to backend
          .then((res) => {
            //frontend got response as a promise from backend after varifying the token
            const {  email, picture, role, _id } = res.data;
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                email,
                name: email.split("@")[0],
                picture,
                token: idTokenResult.token,
                role,
                _id,
              },
            });
          })
          .catch((error) => toast.error(error.message));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense fallback={
      <div className="col text-center p-5">
        _React Redux EC<LoadingOutlined/>MMERCE_
      </div>
    }>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component={UserHistory} />
        <UserRoute exact path="/user/password" component={UserPassword} />
        <UserRoute exact path="/user/wishlist" component={UserWishList} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute
          exact
          path="/admin/subCategory"
          component={SubCategoryCreate}
        />
        <AdminRoute
          exact
          path="/admin/subCategory/:slug"
          component={SubCategoryUpdate}
        />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate}
        />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/subCategory/:slug" component={SubCategoryHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <UserRoute exact path="/checkout" component={Checkout} />
        <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
        <UserRoute exact path="/payment" component={Payment} />
      </Switch>
    </Suspense>
  );
}

export default App;
