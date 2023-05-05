import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatIcon, UserGroupIcon } from "./Icons";
import DropDownProfile from "./DropDownProfile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
const SideBar = () => {
  const tabsClass =
    " w-full rounded-lg flex justify-center items-center p-2 my-2 ";
  // handle tabs
  const [toggleState, setToggleState] = useState(2);
  const toggleTab = (index) => setToggleState(index);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle click out side menu
  const [menu, setMenu] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // khi user login, ta sẽ có data từ table user ở file store
  const user = useSelector((state) => state.user);

  // lấy payload từ socket
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  const getRooms = () => {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };
  
  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general"); // mặc định vô group general
      socket.emit("new-user");
    }
  }, [user]);

  const joinRoom = (room, isPublic = true) => {
    if (!user) return navigate("/login");
    socket.emit("join-room", room);
    setCurrentRoom(room);
    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    dispatch(resetNotifications(room));
  };
  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom != room) dispatch(addNotifications(room));
  });
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  const orderId = (id1, id2) => {
    if (id1 > id2) return id1 + "-" + id2;
    else return id2 + "-" + id1;
  };

  const handlePrivateMessage = (mem) => {
    setPrivateMemberMsg(mem);
    const roomId = orderId(user._id, mem._id);
    joinRoom(roomId, false);
  };

  return (
    <div className="fixed shadow-xl h-screen bg-white max-w-[340px] min-w-[340px] ">
      <div className="flex">
        {/* Button */}
        <div className="w-[62px] border-r h-screen border-gray-300 p-2 flex flex-col">
          <div className="font-bold my-4">LOGO</div>
          <button
            className={
              toggleState === 2
                ? `${tabsClass} bg-gray-200/70 text-primary`
                : `${tabsClass} text-gray-400`
            }
            onClick={() => toggleTab(2)}
          >
            <UserGroupIcon />
          </button>
          <button
            className={
              toggleState === 1
                ? `${tabsClass} bg-gray-200/70 text-primary`
                : `${tabsClass} text-gray-400`
            }
            onClick={() => toggleTab(1)}
          >
            <ChatIcon />
          </button>
          <div className="mt-auto mb-4 ">
            <div className="relative" ref={menuRef}>
              <div
                className="cursor-pointer rounded-full h-11 w-11 overflow-hidden border-2 border-primary"
                onClick={() => setMenu(!menu)}
              >
                <img src={user?.avatar} alt="1" />
              </div>

              <DropDownProfile menu={menu} user={user} />
            </div>
          </div>
        </div>

        {/* message right here */}
        <div className="w-full p-2">
          <div
            className={
              toggleState === 1 ? "content  active-content" : "content"
            }
          >
            <h2 className="font-bold text-lg p-3">Chat with your friends</h2>
            <hr className="mb-3" />
            <div className="overflow-y-scroll h-[86vh] pr-2">
              {members.map((item) =>
                item?._id === user?._id ? (
                  <></>
                ) : (
                  <div
                    key={item.avatar}
                    className={` p-2 w-full hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-2  ${
                      privateMemberMsg?._id == item?._id &&
                      "bg-primary/20 hover:bg-primary/20"
                    }`}
                    onClick={() => handlePrivateMessage(item)}
                  >
                    <div className="relative">
                      <img
                        src={item.avatar}
                        className="w-14 h-14 object-cover rounded-full border border-primary"
                        alt={item.avatar}
                      />
                      {item.status == "online" ? (
                        <div className="absolute h-4 w-4 bg-green-400 right-0 top-10 rounded-full border-2 border-white"></div>
                      ) : (
                        <div className="absolute h-4 w-4 bg-gray-400 right-0 top-10 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <p className="capitalize font-medium"> {item.name}</p>
                  </div>
                )
              )}
            </div>
          </div>
          <div
            className={
              toggleState === 2 ? "content  active-content" : "content"
            }
          >
            <h2 className="font-bold text-lg p-3">Chat groups</h2>
            <hr className="mb-3" />
            <div className="overflow-y-scroll h-[86vh] pr-2  ">
              {rooms.map((item) => (
                <div
                  key={item}
                  className={` p-2 w-full hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-2 ${
                    currentRoom == item && "bg-primary/20 hover:bg-primary/20"
                  }`}
                  onClick={() => joinRoom(item)}
                >
                  <img
                    src="http://picsum.photos/200"
                    className="w-14 h-14 object-cover rounded-full border border-primary"
                  />
                  <div className="flex !justify-between w-full pr-2">
                    <p className="capitalize font-medium">{item}</p>
                    <p
                      className={`bg-primary text-white h-4 w-4 text-center text-xs rounded-full    ${
                        user?.newMessages[item] ? "visible" : "hidden"
                      }`}
                    >
                      {user?.newMessages[item]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
