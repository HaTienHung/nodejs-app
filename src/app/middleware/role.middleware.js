import User from "../models/User.js"; // đảm bảo import đúng
import Role from "../models/Role.js";

export function roleMiddleware(roleNames) {
  return async function (req, res, next) {
    try {
      // console.log("roleNames type:", typeof roleNames);
      const allowedRoles = roleNames.split("|");

      const user = await User.findById(req.user.id).populate("role");

      if (!user || !allowedRoles.includes(user.role?.name)) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập vào trang!" });
      }

      next();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ", error: err.message });
    }
  };
}
