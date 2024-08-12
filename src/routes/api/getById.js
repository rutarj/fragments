// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

const getFragmentUsingId = async (req, res) => {
  let ownerId = req.user;
  const { id } = req.params;
  const arr = id.split('.');
  const extension = arr[1] ? '.' + arr[1] : null;
  const fragmentId = arr[0];
  let fragmentMetaData, fragment;

  try {
    // Get the fragments meta data using the fragment id and owner id.
    fragmentMetaData = await Fragment.byId(ownerId, fragmentId);

    // Create the fragment object by passing the fragment metadata.
    fragment = new Fragment(fragmentMetaData);
  } catch (error) {
    logger.error(`No fragments found with id ${id}`);
    res
      .status(404)
      .json(
        createErrorResponse(
          404,
          `Check the id! There is no fragment stored with the id ${id}! ${error}`
        )
      );
    return;
  }

  if (extension) {
    logger.debug(`Return the fragment in type ${extension}`);
    if (fragment.formats.includes(extension)) {
      try {
        const fragmentData = await fragment.getConvertedInto(extension);
        logger.debug({ fragmentData }, `Fragment data converted into ${extension}`);
        res.status(200).type(fragment.mimeType(extension)).send(fragmentData);
        return;
      } catch (error) {
        logger.error(error);
        res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
        return;
      }
    } else {
      logger.error({ extension }, 'Unsupport extension demanded!');
      res
        .status(415)
        .json(
          createErrorResponse(415, 'The fragment cannot be converted into the extension specified!')
        );
      return;
    }
  }

  // Get fragment data.
  const fragmentData = await fragment.getData();

  // Send the requested fragments.
  res.status(200).type(fragment.type).send(fragmentData);
};

module.exports = { getFragmentUsingId };
