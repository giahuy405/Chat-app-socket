import React from "react";
import { useLogoutUserMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

import persistStore from "redux-persist/es/persistStore";
import { persistor } from "../store";
import { LogoutIcon, SettingIcon } from "./Icons";

const DropDownProfile = ({ menu, user }) => {
  const [logoutUser, { error }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser(user);
    localStorage.clear();
    persistor.purge();
    navigate("/");
  };

  return (
    <div className={`dropDownProfile bg-white shadow-lg ${menu ? "active" : "inactive"}`}>
      <ul className="flex flex-col">
        <li className="!bg-transparent !cursor-default">{user?.email}</li>
        <li className="border-t mx-1 !bg-transparent !cursor-default"></li>
        <li>
          <SettingIcon /> Setting
        </li>
        <li onClick={handleLogout}>
          <LogoutIcon /> Log out
        </li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
