import jwt from "jsonwebtoken";
import { BadRequestException, UnauthorizedException } from "./errorHandler.js";

function isAuth(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return BadRequestException("Please Login First")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return UnauthorizedException("Invalid or expired token")
  }
}

export default isAuth;