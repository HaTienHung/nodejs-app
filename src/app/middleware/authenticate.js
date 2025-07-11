// middlewares/authenticate.js
import verifyTokenFromHeader from "../../helpers/auth.helper.js";
import { TYPE } from "../../constants/verifyType.js";

export function verifyAccessToken(req, res, next) {
  try {
    // console.log(verifyTokenFromHeader(req, res, TYPE.ACCESS));
    const payload = verifyTokenFromHeader(req, res, TYPE.ACCESS);
    // console.log(payload);

    req.user = payload;
    // console.log(req.user);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}

export function verifyRefreshToken(req, res, next) {
  try {
    const payload = verifyTokenFromHeader(req, res, TYPE.REFRESH);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}
