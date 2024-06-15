const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const api = process.env.API_URL || 'http://localhost:8080';
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  if (!Fragment.isSupportedType(req.get('Content-Type'))) {
    res.status(415).json(createErrorResponse(415, 'Content-Type is not supported'));
  } else {
    try {
      const fragment = new Fragment({
        ownerId: req.user,
        type: req.get('Content-type'),
        size: req.body.length,
      });
      await fragment.setData(req.body);
      await fragment.save();
      res.set('location', `${api}/v1/fragments/${fragment.id}`);
      res.status(201).send(createSuccessResponse({ fragment }));
      res.send(createSuccessResponse({ fragment }));
      logger.info({ fragment: fragment }, `Fragment have been posted successfully`);
    } catch (err) {
      logger.error(err, 'Error posting fragment');
      if (!res.headersSent) {
        res.status(500).json(createErrorResponse(500, 'Unable to POST the fragment'));
      }
    }
  }
};
