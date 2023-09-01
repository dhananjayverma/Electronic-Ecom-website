import React, { useState } from "react";
import { auth } from "../../firebase/firbase";
import { toast } from "react-toastify";

import UserNav from "../../component/nav/UserNav";
import UserPanel from "./UserUtils";

const UserPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(password)
    setLoading(true);

   await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        toast.success("Password updated successfully.");
        setPassword('')
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(err.message);
      });
  };

  const paswordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-control"
          placeholder="Enter new password"
          disabled={loading}
          autoFocus
        />
        <br />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={!password || password.length < 6 || loading}
        >
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <UserPanel
      UserNav={UserNav}
      pageText="User password update Page"
      paswordUpdateForm={paswordUpdateForm}
      passwordUpdateLabel="Update Password"
      loading={loading}
    />
  );
};

export default UserPassword;
