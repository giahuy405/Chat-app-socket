const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    console.log(req.body);
    const user = await User.create({ name, email, password, avatar });
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if (e.code == 11000) {
      // lỗi 11000 là của tk mongoDB trường hợp bị duplicate key id, insert data có key trùng
      msg = "User already exists";
    } else {
      msg = e.message;
    }
 
    res.status(400).json(msg);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

module.exports = {
  createUser,
  login,
};
