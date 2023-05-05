import React, { useContext, useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon } from "./Icons";
import { AppContext } from "../context/appContext";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const {
    socket,
    currentRoom,
    setCurrentRoom,
    privateMemberMsg,
    setPrivateMemberMsg,
    messages,
    setMessages,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const messageRef = useRef(null);
  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  }

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log(roomMessages);
    setMessages(roomMessages);
  });

  // trả về dữ liệu dạng ntn -> 05/04/2023
  const todayDate = getFormattedDate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date(); // dạng ntn ->  Thu May 04 2023 22:53:18 GMT+0700 (Indochina Time)
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes(); //
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    // thằng user nhắn xong nó gửi qua đây
    // general dsa sdal asl  {user} 23:13 05/04/2023

    socket.emit("message-room", roomId, message, user, time, todayDate);

    setMessage("");
  };

  function scrollToBottom() {
    // hàm này viết theo kiểu function, viết theo ARF sẽ ko chạy
    messageRef.current?.scrollIntoView({ block:"end"});
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <div className="message-output pt-10">
        {privateMemberMsg && (
          <div className="fixed bg-white shadow-lg top-0 w-full p-3 flex items-center gap-3">
            <img
              src={privateMemberMsg?.avatar}
              alt={privateMemberMsg?.avatar}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <p className="font-semibold">{privateMemberMsg?.name}</p>
          </div>
        )}
        {currentRoom && !privateMemberMsg && (
          <div className="fixed bg-white shadow-lg top-0 w-full p-3 flex items-center gap-3">
            <img
              src='http://picsum.photos/200'
              alt='2'
              className="w-10 h-10 rounded-full object-cover border"
            />
            <p className="font-semibold">{currentRoom}</p>
          </div>
        )}
        {messages.map(({ _id, messagesByDate }) => (
          <div key={_id} className="px-6">
            <div className="text-xs text-center text-gray-400">{_id}</div>
            {messagesByDate.map(
              ({ content, date, from: sender, time, to, _id }) =>
                sender?._id == user?._id ? (
                  <div className="message flex my-4 justify-end" key={_id}>
                    <div className="bg-gray-300 rounded-full p-2 px-4 ml-2">
                      {content}
                    </div>
                  </div>
                ) : (
                  <div className="message flex my-4" key={_id}>
                    <img
                      src={sender.avatar}
                      className="h-9 w-9 rounded-full object-cover"
                      alt={sender.avatar}
                    />
                    <div className="bg-gray-300 rounded-full p-2 px-4 ml-2">
                      {content}
                    </div>
                  </div>
                )
            )}
          </div>
        ))}
        <div ref={messageRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex px-8">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-md bg-gray-200/70"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-14 flex items-center justify-center hover:bg-gray-200 rounded-full mx-4"
        >
          <PaperAirplaneIcon />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
