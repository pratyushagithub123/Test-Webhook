"use strict";
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Server = require("../../../models/server");
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const search_keyword = req.query.search;
    if (!search_keyword)
      return res.serverError(
        404,
        ErrorHandler(constants.error.server.searchKeywordRequired)
      );

    let parts = await Part.query(function (qb) {
      qb.where("server_description", "ilike", `%${search_keyword}%`)
        .andWhere("active_status", "!=", constants.activeStatus.deleted)
        .orWhere("store_name", "ilike", `%${search_keyword}%`)
        .orWhere("part_number", "ilike", `%${search_keyword}%`)
        .orWhere("type", "ilike", `%${search_keyword}%`);
    })
      .orderBy("created_at", "DESC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
        columns: [
          "id",
          "breadcrumbs",
          "part_number",
          "server_description",
          "store_name",
          "url",
          "image",
          "type",
        ],
      });

    let partServers = [];
    for (var i = 0; i < parts.length; i++) {
      const partObj = parts.toJSON()[i];
      const server_description = partObj.server_description;
      let fetchServer = await Server.where({
        server_description: server_description,
      }).fetch({ require: false });
      partObj.server = fetchServer.toJSON();
      partServers.push({part: partObj});
    }
    let count = await Part.query(function (qb) {
      qb.where("server_description", "ilike", `%${search_keyword}%`)
        .andWhere("active_status", "!=", constants.activeStatus.deleted)
        .orWhere("store_name", "ilike", `%${search_keyword}%`)
        .orWhere("part_number", "ilike", `%${search_keyword}%`)
        .orWhere("type", "ilike", `%${search_keyword}%`);
    }).count();
    return res.success({ partServers: partServers, count: count });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
