import React, { useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../../firebase/firbase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//utils import
import { createOrUpdateUser } from "../../utils/auth";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const roleBasedRedirect = (res) => {
    const { role } = res.data;

    //check if intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      history.push(
        role === "subscriber" ? "/user/history" : "/admin/dashboard"
      );
    }
    // if(role==="admin"){
    //    history.push('/admin/dashboard')
    //    return
    //   }
    // history.push('user/history')
  };

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
  }, [user, history]);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token) //frotend is sending token to backend
        .then((res) => {
          //frontend got response as a promise from backend after varifying the token
          const { name, email, picture, role, _id } = res.data;
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name,
              email,
              picture,
              token: idTokenResult.token,
              role,
              _id,
            },
          });
          setLoading(false);
          roleBasedRedirect(res);
        })
        .catch((error) => toast.error(error.message));
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleSubmit = async (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            const { name, email, picture, role, _id } = res.data;
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name,
                email,
                picture,
                token: idTokenResult.token,
                role,
                _id,
              },
            });
          })
          .catch((error) => toast.error(error.message));
        history.push("/");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              {loading ? (
                <h4 className="text-danger">Loading...</h4>
              ) : (
                <h5>Login</h5>
              )}
              <input
                type="email"
                className="form-control "
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control "
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              type="primary"
              shape="round"
              className="mb-3"
              block
              size="large"
              icon={<MailOutlined />}
              disabled={!email || password.length < 6}
            >
              Login with Email and Password
            </Button>
            <Button
              onClick={googleSubmit}
              type="danger"
              shape="round"
              className="mb-3"
              icon={<GoogleOutlined />}
              block
              size="large"
            >
              Login with Google
            </Button>
            <Link to="/forgot/password" className="float-right text-danger">
              Forgot Password
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
