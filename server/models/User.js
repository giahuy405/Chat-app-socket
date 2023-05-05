const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username cann't be blank"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email cann't be blank"],
      index: true,
      validate: [isEmail, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Password cann't be blank"],
    },
    avatar: {
      type: String,
    },
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false }
);

// định nghĩa 1 cái hook middleware, sẽ chạy trước khi data được lưu vào database
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); // check password đã thay đổi chưa

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("invalid email or password");
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
