import jwt from "jsonwebtoken";

const getTokenFromHeader = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  return { payload };
};

export default getTokenFromHeader;
