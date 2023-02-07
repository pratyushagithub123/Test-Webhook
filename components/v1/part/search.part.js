"use strict";
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const search_keyword = req.query.search;
    if (!search_keyword)
      return res.serverError(404, ErrorHandler(constants.error.part.searchKeywordRequired) );

    let parts = await Part.query(function (qb) {
      qb.where("part_number", "ilike", `%${search_keyword}%`)
        .andWhere("active_status", "!=", constants.activeStatus.deleted)
        .orWhere("store_name", "ilike", `%${search_keyword}%`)
        .orWhere("server_description", "ilike", `%${search_keyword}%`)        
    })
      .orderBy("created_at", "DESC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
        columns: [
          "id",
          "part_number",
          "part_description",
          "store_name",
          "server_description",
          "type",
          "image",
          "url",
        ],
      });
    let partsCount = await Part.query(function (qb) {
      qb.where("part_number", "ilike", `%${search_keyword}%`)
        .andWhere("active_status", "!=", constants.activeStatus.deleted)
        .orWhere("store_name", "ilike", `%${search_keyword}%`)
        .orWhere("server_description", "ilike", `%${search_keyword}%`)        
    }).count();

    return res.success({ parts, count: partsCount });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
