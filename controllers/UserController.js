const mongoose = require("mongoose");

const User = require("../models/User");
const { sendErrorResponse } = require("../utils/utils");
const ERRORS = require("../constants/constants");

class UserController {
  async create(req, res) {
    try {
      const { username } = req.body;
      if (!username || username.trim().length === 0) {
        return sendErrorResponse(res, 400, ERRORS.USERNAME_IS_REQUIRED);
      }

      const duplicate = await User.findOne({ username }).exec();
      if (duplicate) {
        return sendErrorResponse(res, 409, ERRORS.USERNAME_EXIST);
      }

      const user = await User.create({ username });

      return res.status(200).json(user);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }

  async getAll(req, res) {
    try {
      const users = await User.find();

      return res.status(200).json(users);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }

  async getSingle(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendErrorResponse(res, 404, ERRORS.USER_NOT_FOUND);
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, ERRORS.USER_ID_IS_WRONG);
      }

      const user = await User.findById(id);

      return res.status(200).json(user);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }

  async update(req, res) {
    try {
      const { user } = req.body;
      if (!user._id) {
        return sendErrorResponse(res, 404, ERRORS.USER_NOT_FOUND);
      }

      const updatedUser = await User.findById(user._id, user, { new: true });

      return res.status(200).json(updatedUser);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendErrorResponse(res, 404, ERRORS.USER_NOT_FOUND);
      }

      const user = await User.findByIdAndDelete(id);

      return res.status(200).json(user);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }
}

module.exports = new UserController();