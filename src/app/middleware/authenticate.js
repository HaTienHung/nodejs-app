// middlewares/authenticate.js
import jwt from "jsonwebtoken";
import getTokenFromHeader from "../../helpers/auth.helper.js";

export function verifyAccessToken(req, res, next) {
  const accessToken = getTokenFromHeader(req, res);

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    // console.log(decoded);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}

export function verifyRefreshToken(req, res, next) {
  const refreshToken = getTokenFromHeader(req, res);

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}
