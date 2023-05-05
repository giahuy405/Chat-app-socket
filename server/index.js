const express = require("express");
const app = express();

const rooms = ["general", "love cat", "hội wibu chúa", "financial",'somethign','new','abc','xyz','dom','anime','dog'];
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const User = require("./models/User");
const Message = require("./models/Message");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

require("dotenv").config();

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});

const mongoose = require("mongoose");

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;    
}

// sort month/day/year
//       02/25/2020  -> 20200225
function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    // 20230405 // năm tháng ngày
    return date1 < date2 ? -1 : 1;
  });
}

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

// socket connection
io.on("connection", (socket) => {
  // new user
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  //join room
  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  // message room                roomId  message   user   time todayDate
  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);

    //  dùng io để gửi từ server cho tất cả client trong room , socket.io thì chỉ 1 server = 1 client
    io.to(room).emit("room-messages", roomMessages); // gửi dữ liệu này qua thằng FE

    // broadcast.emit() để broadcast phát sóng sự kiện 'notifications' tới các client đang kết nối với server trong cùng 1 phòng chat trừ thằng client gửi yêu cầu
    socket.broadcast.emit("notifications", room);
  });

  // logout
  app.delete("/user/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
    
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // phải dùng httpServer thì mới kết nôi được socket io
    httpServer.listen(PORT);
  })
  .catch((error) => console.log(`${error} did not connect`));
