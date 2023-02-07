"use strict";
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const knex = require("../../../config/knex.config").knex;
module.exports = async (req, res) => {
  try {
    const abc = req.params.ABC.trim();
    if (!abc)
      return res.serverError(
        404,
        ErrorHandler(constants.error.server.searchKeywordRequired)
      );
    const tags = abc.split(" ")

    let serverABC = knex("servers")
      .select("A", "B", "C","store_name")
      .count("* as ABC_count")
    for (let id = 0; id < tags.length; id++) {
      if (id === 0) {
        serverABC.where("server_description", "ilike", `%${tags[id]}%`)
      }
      if (id > 0) {
        serverABC.andWhere("server_description", "ilike", `%${tags[id]}%`)
      }
    }
    serverABC.andWhere("active_status", "!=", constants.activeStatus.deleted)
      .groupBy("A", "B", "C","store_name")
      .havingRaw(`"A" != '' AND "B" != '' AND "C" != ''`)
    tags.map(server => {
      serverABC
        .where("server_description", "ilike", `%${server}%`)
    })
    serverABC.offset((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);
    // for count group By ABC
    let serverABCCount = knex("servers")
      .select("A", "B", "C","store_name")
    for (let id = 0; id < tags.length; id++) {
      if (id === 0) {
        serverABC.where("server_description", "ilike", `%${tags[id]}%`)
      }
      if (id > 0) {
        serverABC.andWhere("server_description", "ilike", `%${tags[id]}%`)
      }
    }
    serverABC.andWhere("active_status", "!=", constants.activeStatus.deleted)
      .groupBy("A", "B", "C","store_name")
      .havingRaw(`"A" != '' AND "B" != '' AND "C" != ''`)
    tags.map(server => {
      serverABCCount
        .where("server_description", "ilike", `%${server}%`)
    })
    const searchABC = await serverABC
    const searchCount = await serverABCCount
    return res.success({ searchABC, count: searchCount.length });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};