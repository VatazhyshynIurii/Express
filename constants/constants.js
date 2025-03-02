const ERRORS = {
  USER_NOT_FOUND: 'User not found',
  USERNAME_IS_REQUIRED: 'Username is required. It should be in a string format.',
  USERNAME_EXIST: 'Username already exist',
  USER_ID_IS_WRONG: 'User ID is in wrong format',
  DURATION_IS_REQUIRED: 'Duration is required. It should be a number.',
  DESCRIPTION_IS_REQUIRED: 'Description is required. It should be in a string format.',
  DESCRIPTION_WRONG_FORMAT: 'Description should be in a string format',
  DURATION_WRONG_FORMAT: 'Duration should be a number',
  WRONG_FORMAT: 'Date is in wrong format. Use YYYY-MM-DD format.',
  FROM_QUERY_PARAM_WRONG_FORMAT: `'from' query parameter is in wrong format. Use YYYY-MM-DD format.`,
  TO_QUERY_PARAM_WRONG_FORMAT: `'to' query parameter is in wrong format. Use YYYY-MM-DD format.`,
  LIMIT_QUERY_PARAM_WRONG_FORMAT: `'limit' query parameter should be a number.`
};

module.exports = ERRORS;