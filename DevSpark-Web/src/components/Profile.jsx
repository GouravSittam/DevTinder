import React, { useRef } from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import store from "../utils/appStore";

const Profile = () => {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
  );
};

export default Profile;
