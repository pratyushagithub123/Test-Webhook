"use strict";
const { ErrorHandler, LogHelper } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Server = require("../../../models/server");
const Part = require("../../../models/part");
const knex = require("../../../config/knex.config").knex;

module.exports = async (req, res) => {
  try {
    const search_a = req.query.A;
    const search_b = req.query.B;
    const search_c = req.query.C;
    const storeName = req.query.store_name;
    if (!search_a || !search_b || !search_c)
      return res.serverError(
        400,
        ErrorHandler(constants.error.server.searchKeywordRequired)
      );

    let normalizeServer = await Server.query(function (qb) {
      qb.where("A", "=", search_a)
        .andWhere("B", "=", search_b)
        .andWhere("C", "=", search_c)
        .andWhere("active_status", "!=", constants.activeStatus.deleted);
    }).fetch({
      require: false,
    });
    if (!normalizeServer)
      return res.serverError(
        400,
        ErrorHandler(constants.error.server.notFound)
      );
    let where = {};
    if (
      normalizeServer.attributes.A == "" &&
      normalizeServer.attributes.B == "" &&
      normalizeServer.attributes.C == ""
    ) {
      where = {
        A: search_a,
        B: search_b,
        C: search_c,
      };
    } else {
      where = {
        A: normalizeServer.attributes.A,
        B: normalizeServer.attributes.B,
        C: normalizeServer.attributes.C,
      };
    }
    const serversABC = await Server.where(where).fetchAll({ require: false });
    const serverMatch = serversABC
      .toJSON()
      .map((server) => server.server_description);
    let servers = await Part.query(function (qb) {
      qb.where("server_description", "in", serverMatch);
    })
      .orderBy("created_at", "DESC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
      });
    let server = await Server.query(function (qb) {
      qb.where("A", "=", search_a)
        .andWhere("B", "=", search_b)
        .andWhere("C", "=", search_c)
        .andWhere("store_name", "=", storeName)
        .andWhere("active_status", "!=", constants.activeStatus.deleted);
    }).fetch({
      require: false,
      offset: (req.query.page - 1) * req.query.limit,
      limit: req.query.limit,
    });
    if (!server)
      return res.serverError(
        400,
        ErrorHandler(constants.error.server.notFound)
      );

    let serverDescriptionList = await knex("servers")
      .select("server_description")
      .where("A", "ilike", `%${serversABC.toJSON()[0].A}%`)
      .where("B", "ilike", `%${serversABC.toJSON()[0].B}%`)
      .where("C", "ilike", `%${serversABC.toJSON()[0].C}%`)
      .andWhere("active_status", "!=", constants.activeStatus.deleted)
      .groupBy("server_description")
      .offset((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);

    let similar_server = [];
    for (let server = 0; server < serverDescriptionList.length; server++) {
      let similarServers = await Server.where({
        server_description: serverDescriptionList[server].server_description,
      }).fetch({
        require: false,
      });
      const serverDescription = similarServers.toJSON().server_description;
      const serverA = similarServers.toJSON().A;
      const serverB = similarServers.toJSON().B;
      const serverC = similarServers.toJSON().C;
      similar_server.push({
        server_description: serverDescription,
        A: serverA,
        B: serverB,
        C: serverC,
      });
    }

    let specification_same = await Server.query(function (qb) {
      qb.where("A", "=", search_a)
        .andWhere("B", "=", search_b)
        .andWhere("C", "=", search_c)
        .andWhere("active_status", "!=", constants.activeStatus.deleted);
    }).fetchPage({
      require: false,
    });
    const serverDescription = [
      server.toJSON().A,
      server.toJSON().B,
      server.toJSON().C,
    ];
    const combineABC = serverDescription.join(" ");
    var maxMemory = specification_same
      .toJSON()
      .map((specs) => specs.formatted_specs.max_memory);
    var memorySlot = specification_same
      .toJSON()
      .map((specs) => specs.formatted_specs.memory_slot);
    server = Object.assign(
      server.toJSON(),
      {
        server_description: combineABC,
        // specification: { max_memory: maxMemory, memory_slot: memorySlot },
      },
      { server_parts: servers.toJSON() },
      { similar_server }
    );
    // delete server.formatted_specs;
    let count = await Part.query(function (qb) {
      qb.where("server_description", "in", serverMatch);
    }).count();
    return res.success({ server: server, count: Number(count) });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
