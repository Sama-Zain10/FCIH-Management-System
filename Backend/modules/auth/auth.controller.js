import UserModel from "../../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException
} from "../../middleware/errorHandler.js";

import asyncHandler from "../../middleware/asyncHandler.js";

// ========================= Signup =========================

export const signup = asyncHandler(async (req, res) => {

  const newUser = req.body;

  const existingUser = await UserModel.findOne({
    email: newUser.email
  });

  if (existingUser) {
    ConflictException("User already exists");
  }

  const user = await UserModel.create(newUser);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    message: "User created successfully",
    user: userResponse
  });

});

// ========================= Login =========================

export const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    BadRequestException("Please enter email and password");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    NotFoundException("User not found");
  }

  const isValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValid) {
    UnauthorizedException("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  res.status(200).json({
    message: "Login successful",
    token
  });

});
export function forgotPassword(req, res, next) {
  const { email } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return NotFoundException("No account with this email");
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 أرقام
      user.resetCode = code;
      user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // صالح 10 دقايق
      return user.save().then(() => {
        return sendResetEmail(email, code);
      });
    })
    .then(() => {
      res.status(200).json({ message: "Verification code sent to email" });
    })
    .catch(next);
}

export function verifyResetCode(req, res, next) {
  const { email, code } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return NotFoundException("No account with this email");
      }
      if (user.resetCode !== code) {
        return BadRequestException("Invalid verification code");
      }
      if (user.resetCodeExpires < Date.now()) {
        return BadRequestException("Verification code expired");
      }
      res.status(200).json({ message: "Code verified" });
    })
    .catch(next);
}

export function resetPassword(req, res, next) {
  const { email, code, password } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return NotFoundException("No account with this email");
      }
      if (user.resetCode !== code) {
        return BadRequestException("Invalid verification code");
      }
      if (user.resetCodeExpires < Date.now()) {
        return BadRequestException("Verification code expired");
      }

      user.password = password;       
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Password reset successfully" });
    })
    .catch(next);
}
function sendResetEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Code",
    text: `Your verification code is: ${code}`
  });
}