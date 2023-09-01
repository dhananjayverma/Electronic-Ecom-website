import React, { useState,useEffect } from "react";
import { auth } from "../../firebase/firbase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Register = ({history}) => {
  const [email, setEmail] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user,history]);

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, config);

    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );

    //save user email in local storage
    window.localStorage.setItem("emailForRegistration", email);

    //clearing out the form
    setEmail("");
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <h5>Register Email</h5>
              <input
                type="email"
                className="form-control "
                value={email}
                onChange={handleChange}
                autoFocus
                placeholder="Enter email"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
