import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [emailId, setEmailId] = useState("grrrv@gmail.com");
  const [password, setPassword] = useState("$2b$09$9fTGdBnZZMP1Ae9HrZo78ubN3KcgWs5/4cDitQGBpBf/VT2n3Q2a6");
  const handelLogin = async () => {
    try {
      await axios.post("http://localhost:7777/login", {
        emailId,
        password,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex  justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div>
            <fieldset className="fieldset ">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="text"
                value={emailId}
                className="input"
                placeholder="joe@gmail.cpm"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset  ">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="text"
                value={password}
                className="input"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <div className="card-actions justify-center m-2">
            <button className="btn btn-primary " onClick={handelLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
