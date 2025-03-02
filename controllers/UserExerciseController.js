const mongoose = require('mongoose');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const url = require('url');
const User = require("../models/User");
const Exercise = require("../models/Exercise");
const { getFilteredLogs, validateDate, sendErrorResponse } = require("../utils/utils");
const ERRORS = require("../constants/constants");

class UserExerciseController {
  async create(req, res) {
    try {
      const { id } = req.params;

      if (!id) return sendErrorResponse(res, 400, ERRORS.USER_NOT_FOUND);
      if (!mongoose.Types.ObjectId.isValid(id)) return sendErrorResponse(res, 400, ERRORS.USER_ID_IS_WRONG);

      const user = await User.findById(id).exec();

      if (!user) return sendErrorResponse(res, 400, ERRORS.USER_NOT_FOUND);

      const { duration, description, date } = req.body;

      if (typeof description !== 'string') return sendErrorResponse(res, 400, ERRORS.DESCRIPTION_WRONG_FORMAT);
      if (description.trim().length === 0) return sendErrorResponse(res, 400, ERRORS.DESCRIPTION_IS_REQUIRED);
      if (typeof duration === 'string' && duration.trim().length === 0) {
        return sendErrorResponse(res, 400, ERRORS.DURATION_IS_REQUIRED);
      }

      if (!Number(duration)) return sendErrorResponse(res, 400, ERRORS.DURATION_WRONG_FORMAT);
      if (date && !validateDate(date)) return sendErrorResponse(res, 400, ERRORS.WRONG_FORMAT);

      const response = await Exercise.create({
        userId: id,
        exerciseId: uuid(),
        duration,
        description,
        date: date || `${format(new Date(), `yyyy-MM-dd`)}`,
        username: user.username
      });

      return res.status(200).json(response);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }

  async getLogs(req, res) {
    try {
      const { id } = req.params;

      if (!id) return sendErrorResponse(res, 400, ERRORS.USER_NOT_FOUND);
      if (!mongoose.Types.ObjectId.isValid(id)) return sendErrorResponse(res, 400, ERRORS.USER_ID_IS_WRONG);

      const user = await User.findById(id);

      if (!user) return sendErrorResponse(res, 400, ERRORS.USER_NOT_FOUND);

      const exercises = await Exercise.find({ userId: id }) || [];
      const { from, to, limit } = url.parse(req.url, true).query;

      const filteredLogsOrErrorMessage = getFilteredLogs( exercises, from, to, limit );

      if (typeof filteredLogsOrErrorMessage === 'string') {
        return sendErrorResponse(res, 400, filteredLogsOrErrorMessage);
      }

      const response = {
        _id: user._id,
        username: user.username,
        logs: filteredLogsOrErrorMessage,
        count: filteredLogsOrErrorMessage.length
      };

      return res.status(200).json(response);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }
  }
}

module.exports = new UserExerciseController();