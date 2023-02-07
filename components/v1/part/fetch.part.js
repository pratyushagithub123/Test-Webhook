"use strict";
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const params = req.params.id;
    const part = await Part.where({ id: params }).fetch({ require: false });
    if (!part)
      return res.serverError(400, ErrorHandler(constants.error.part.notFound));

    return res.success({ part });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
