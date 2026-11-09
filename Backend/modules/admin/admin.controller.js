import UserModel from "../../model/user.js";
import { NotFoundException } from "../../middleware/errorHandler.js";
import asyncHandler from "../../middleware/asyncHandler.js";

// ====================== Get All Users ======================
export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password");

  res.status(200).json(users);
});

// ====================== Update User ======================
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    NotFoundException("User Not Found");
  }

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

// ====================== Delete User ======================
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findByIdAndDelete(id);

  if (!user) {
    NotFoundException("User Not Found");
  }

  res.status(200).json({
    message: "User deleted successfully",
  });
});