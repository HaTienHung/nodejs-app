import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../../../utils/jwt.js";

class AuthController {
  // [POST]  api/app/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Kiểm tra user tồn tại
      const user = await User.findOne({ email }).select("+password");
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "Email không đúng" });
      }

      // 2. So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mật khẩu không đúng" });
      }

      // 3. Tạo token
      const payload = {
        id: user._id,
        role: user.role,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Gửi refresh token vào httpOnly cookie
      // res.cookie("refresh_token", refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      // });

      // 4. Trả về thông tin user + token
      res.json({
        message: "Đăng nhập thành công",
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // [POST]  /app/auth/refresh-token
  async refreshToken(req, res) {
    try {
      const newAccessToken = generateAccessToken({
        id: req.user.id,
        role: req.user.role,
      });
      res.json({
        newAccessToken,
      });
    } catch (err) {
      return res.status(401).json({ message: "Refresh token không hợp lệ" });
    }
  }

  // [POST]  /app/auth/me
  async me(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      console.log(user);

      res.json({
        user,
      });
    } catch (err) {
      return res.status(401).json({ message: "Accesss token không hợp lệ" });
    }
  }

  // [POST]  /app/auth/register
  async register(req, res) {
    console.log("[Validated]", req.validated);
    const { name, email, phone_number, password, age, address } = req.validated;

    // console.log(name);

    // Field "is_admin", "role_id", ... sẽ không bao giờ lọt vào đây
    const user = await User.create(req.validated);

    res.status(201).json(user);
  }

  // [POST]  api/auth/app/change-password
  async changePassword(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id }).select("+password");

      if (!user) {
        return res.status(401).json({ message: "Không tìm thấy người dùng !" });
      }
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Mật khẩu không đúng" });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(401)
          .json({ message: "Xác nhận mật khẩu không đúng , hãy nhập lại" });
      }

      user.password = newPassword;

      await user.save();

      res.json({ message: "Cập nhật thành công" });
    } catch (error) {
      res.json("failed");
    }
  }
}

export default new AuthController();
