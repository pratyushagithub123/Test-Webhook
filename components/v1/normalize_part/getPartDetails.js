"use strict";
const { ErrorHandler, LogHelper } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Server = require("../../../models/server");
const Part = require("../../../models/part");
const knex = require("../../../config/knex.config").knex;

module.exports = async (req, res) => {
  try {
    const partID = req.params.id;
    if (isNaN(partID))
      return res.serverError(
        400,
        ErrorHandler(constants.error.server.serverIdInteger)
      );

    const partRes = await Part.where({ id: partID }).fetch({
      require: false,
    });
    if (!partRes)
      return res.serverError(
        404,
        ErrorHandler(constants.error.server.notFound)
      );
    let where = {};
    if (
      partRes.attributes.specification == "" &&
      partRes.attributes.server_description == "" &&
      partRes.attributes.part_description == ""
    ) {
      where = {
        id: partID,
      };
    } else {
      where = {
        part_number: partRes.attributes.part_number
      };
    }

    let parts = await Part.query(function (qb) {
      qb.where(where)
    }).fetchAll({
      require: false
    });
    let skuPart = await Part.query(function (qb) {
      qb.where({ sku: parts.toJSON()[0].sku ? parts.toJSON()[0].sku : "null" })
    }).fetchAll({
      require: false
    });
    const partIdsMatch = skuPart.toJSON().map((part) => part.server_description);
    let serverParts = await Server.query(function (qb) {
      qb.where("server_description", "in", partIdsMatch);
    })
      .orderBy("server_description", "ASC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
      });

    let partDetails = await Part.where({ id: partID }).fetch({
      require: false,
    });
    if (!partDetails)
      return res.serverError(
        404,
        ErrorHandler(constants.error.server.notFound)
      );

    let partNumberList = await knex("parts")
      .select("part_number")
      .where("specification", "=", partRes.toJSON().specification)
      .andWhere("active_status", "!=", constants.activeStatus.deleted)
      .groupBy("part_number")
      .offset((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);

    let similar_part = [];
    for (let part = 0; part < partNumberList.length; part++) {
      let similarParts = await Part.where({
        part_number: partNumberList[part].part_number,
      }).fetch({
        require: false
      });
      let partNumber = similarParts.toJSON().part_number;
      let partId = similarParts.toJSON().id;
      similar_part.push({ part_number: partNumber, id: partId });
    }
    partDetails = Object.assign(
      partDetails.toJSON(),
      { part_servers: serverParts.toJSON() },
      { similar_part }
    );
    let count = await Server.query(function (qb) {
      qb.where("server_description", "in", partIdsMatch);
    }).count();
    return res.success({ part: partDetails, count: Number(count) });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
