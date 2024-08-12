// src/routes/api/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
// const express = require('express');
const { Fragment } = require('../../model/fragment');

const updateFragment = async (req, res) => {
  let fragment;
  const { id } = req.params;
  const fragmentData = req.body;
  const ownerId = req.user;

  let fragmentMetadata;
  try {
    fragmentMetadata = await Fragment.byId(ownerId, id);

    fragment = new Fragment(fragmentMetadata);
  } catch (error) {
    return res.status(404).json(createErrorResponse(`Fragment not found${error}`));
  }

  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Type error'));
  } else {
    try {
      // frag = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
      await fragment.save();
      await fragment.setData(fragmentData);

      res.status(201).json(
        createSuccessResponse({
          fragment: await Fragment.byId(ownerId, id),
        })
      );
    } catch (error) {
      res.status(400).json(createErrorResponse(400, error));
    }
  }
};

module.exports = { updateFragment };
