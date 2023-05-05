import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import FormChat from "../components/FormChat";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const user = useSelector(state=>state.user);
  const navigate = useNavigate();

  // chưa login -> qua login 
  useEffect(()=>{
    if(!user) return navigate('/login') 
  },[user])
  return (
    <div className="">
      <SideBar />
      <FormChat />
    </div>
  );
};

export default Chat;
