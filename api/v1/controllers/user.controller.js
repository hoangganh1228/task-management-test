const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

const generate = require("../helpers/generate");
const sendMailHelper = require("../helpers/sendMail");
// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!"
    });
    return;
  }

  const infoUser = {
    email: req.body.email,
    password: md5(req.body.password),
    fullName: req.body.fullName,
    token: generate.generateRandomString(30)
  }

  const user = new User(infoUser);
  user.save();

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Tạo tài khoản thành công!",
    token: token
  });

}

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if(!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  if(password !== user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!"
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token
  });

}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if(!user) {
      res.json({
          code: 400,
          message: "Email không tồn tại!"
      });
      return;
  }

  const otp = generate.generateRandomNumber(8);

  const timeExpire = 5;

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire*60,
  };

  // Việc 1: Lưu vào database
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  forgotPassword.save();

  // Việc 2: Gửi OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
  Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
  Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
`;

sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!"
  });
};

