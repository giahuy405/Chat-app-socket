import React, { Suspense, useEffect, useState } from "react";
import Nav from "./components/Nav";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
// import Login from "./pages/Login";
// import Chat from "./pages/Chat";
import Layout from "./Layout/Layout";
import { useSelector } from "react-redux";

import { AppContext, socket } from "./context/appContext";
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));

function App() {
  const user = useSelector((state) => state.user);

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  return (
    <AppContext.Provider
      value={{
        socket,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        rooms,
        setRooms,
        newMessages,
        setNewMessages,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<>Loading loading ....</>}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<>Loading loading ....</>}>
                  <Login />
                </Suspense>
              }
            />
            <Route path="/register" element={<SignUp />} />

            <Route
              path="/chat"
              element={
                <Suspense fallback={<>Loading loading ....</>}>
                  <Chat />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
