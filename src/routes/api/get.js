// src/routes/api/get.js
// const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */

// Importing all the utility functions helpful in creating the response!
//const { createSuccessResponse, createErrorResponse } = require('../../response');
//const logger = require('../../logger');

// // This API sends all the fragments of the user in an array!
// const getFragments = async (req, res) => {
//   logger.info(`Get all the fragments of user ${req.user}`);
//   // Get the owner id from the request object.
//   const ownerId = req.user;
//   // If the requst has a query "expand = 1", the user is send all the fragments along with its meta data. Otherwise, just an array of fragments!
//   try {
//     const userFragments = await Fragment.getAllFragments(ownerId, req.query.expand);
//     logger.info({ userFragments }, "List of user's fragment.");
//     res.status(200).json(createSuccessResponse({ fragments: userFragments }));
//   } catch (error) {
//     logger.error(`Internal Server Error ${error}`);
//     res.status(500).json(createErrorResponse(500, 'Internal Server Error!'));
//   }
// };

const getFragments = async (req, res) => {
  let user = req.user;
  const fragmentList = await Fragment.byUser(user, req.query.expand == 1 ? true : false);

  res.status(200).json({
    status: 'ok',
    fragments: fragmentList,
  });
};

module.exports = {
  getFragments,
};
