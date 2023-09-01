import React from "react";

const UserPanel = ({
  UserNav,
  pageText,
  paswordUpdateForm,
  passwordUpdateLabel,
  loading,
}) => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
        {UserNav}
      </div>
      <div className="col">
        {paswordUpdateForm ? (
          <>
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>{passwordUpdateLabel}</h4>
            )}
            {paswordUpdateForm()}
          </>
        ) : (
          pageText
        )}
      </div>
    </div>
  </div>
);

export default UserPanel;
