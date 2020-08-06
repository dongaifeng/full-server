'use strict';

module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    email: { type: String, required: true },
    passwd: { type: String, required: true, select: false }, // select选项 可设置 查询的时候不带上它
    __v: { type: Number, select: false },
    nickname: { type: String, required: true },
    avatar: { type: String, required: false, default: '/user.png' },
  }, {
    timestamps: true,
  });
  return mongoose.model('User', UserSchema);
};
