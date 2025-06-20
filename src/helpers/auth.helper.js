import jwt from "jsonwebtoken";
import { TYPE } from "../constants/verifyType.js";

const verifyTokenFromHeader = (req, res, type) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  const token = authHeader.split(" ")[1];
  console.log(jwt.verify(token, process.env.JWT_ACCESS_SECRET));
  const payload =
    type === TYPE.ACCESS
      ? jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      : jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  return payload;
};

export default verifyTokenFromHeader;
