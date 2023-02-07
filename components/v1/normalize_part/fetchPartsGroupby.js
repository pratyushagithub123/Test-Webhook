"use strict";
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const knex = require("../../../config/knex.config").knex;
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const Parts = req.params.parts;
    if (!Parts)
      return res.serverError(
        404,
        ErrorHandler(constants.error.part.searchKeywordRequired)
      );

    let part = await knex("parts")
      .select("part_number", "store_name", "product_id")
      .count("* as part_count")
      .where("part_number", "ilike", `%${Parts}%`)
      .orWhere("store_name", "ilike", `%${Parts}%`)
      .orWhere("product_id", "ilike", `%${Parts}%`)
      .andWhere("active_status", "!=", constants.activeStatus.deleted)
      .groupBy("part_number", "store_name", "product_id")
      .offset((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);
    if (part == 0) {
      return res.serverError(400, ErrorHandler(constants.error.part.notFound));
    }
    
    let partCount = await knex("parts")
      .select("part_number", "store_name", "product_id")
      .where("part_number", "ilike", `%${Parts}%`)
      .orWhere("store_name", "ilike", `%${Parts}%`)
      .orWhere("product_id", "ilike", `%${Parts}%`)
      .andWhere("active_status", "!=", constants.activeStatus.deleted)
      .groupBy("part_number", "store_name", "product_id");

    let partData = [];
    for (let data = 0; data < part.length; data++) {
      let spec = await Part.query(function (qb) {
        qb.where("part_number", "=", part[data].part_number)
          .andWhere("store_name", "=", part[data].store_name)
          .orWhere("product_id", "=", part[data].product_id)
          .andWhere("active_status", "!=", constants.activeStatus.deleted);
      })
        .orderBy("id", "DESC")
        .fetchAll({
          require: false,
          columns: [
            "id",
            "part_number",
            "part_description",
            "store_name",
            "server_description",
            "specification",
            "product_id"
          ],
        });

      let partInfo = spec.toJSON()[0];
      partInfo.part_count = part[data].part_count;
      partData.push(partInfo);
    }
    if (part == 0)
      return res.serverError(
        400,
        ErrorHandler(constants.error.server.partNumberNotMatched)
      );

    return res.success({ partData, count: partCount.length });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
