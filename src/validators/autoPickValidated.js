import { matchedData } from "express-validator";

export default function autoPickValidated(options = {}) {
  return function (req, res, next) {
    // matchedData chỉ lấy các field đã được validate
    req.validated = matchedData(req, { locations: ["body"], ...options });
    next();
  };
}
