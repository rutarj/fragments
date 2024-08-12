// src/routes/api/getInfo.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

// module.exports = async (req, res) => {
//   let user = crypto.createHash('sha256').update(req.user).digest('hex');
//   const idList = await Fragment.byUser(user);

//   if (idList.includes(req.params.id)) {
//     const findFragment = await Fragment.byId(user, req.params.id);

//     if (findFragment) {
//       res.status(201).json({
//         status: 'ok',
//         fragment: findFragment,
//       });
//     }
//   } else {
//     res.status(401).json({
//       status: 'error',
//       message: 'No fragments found',
//     });
//   }
// };

const getFragmentInfoUsingId = async (req, res) => {
  logger.debug('Get fragment info');
  // Getting the fragment id!
  const fragmentId = req.params.id;
  // Getting the fragment metadata with the fragment and owner id!
  const fragmentMetaData = await Fragment.byId(req.user, fragmentId);

  logger.debug(`Get fragment metadata of ${fragmentId}`);

  // Making sure the fragment meta data associated with the id received exists!
  if (!fragmentMetaData) {
    logger.warn({ fragmentId }, 'Non existing fragment id!');
    res
      .status(404)
      .json(
        createErrorResponse(
          404,
          `Check the id! There is no fragment stored with the id ${fragmentId}!`
        )
      );
    return;
  }

  logger.debug({ fragmentMetaData }, 'Fragment Metadata');
  // Responding to the request with the meta data of the fragment!
  res.status(200).json(createSuccessResponse({ fragment: fragmentMetaData }));
};

module.exports = {
  getFragmentInfoUsingId,
};
