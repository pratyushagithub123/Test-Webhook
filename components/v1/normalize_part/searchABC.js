const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Server = require("../../../models/server");
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const serverDescription = req.body.part_number;
    const searchKey = req.body.search_keyword.trim();

    const partFetch = await Part.query(function (qb) {
      qb.where("part_number", "in", serverDescription).andWhere(
        "active_status",
        "!=",
        constants.activeStatus.deleted
      );
    })
      .orderBy("created_at", "DESC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
      });
    const serverDesc = []
    partFetch.toJSON().map(part => {
      const partServer = part.server_description
      serverDesc.push(partServer);
    });

    if (!searchKey) {
      let serverFetch = await Server.query(function (qb) {
        qb.where("server_description", "in", serverDesc).andWhere(
          "active_status",
          "!=",
          constants.activeStatus.deleted
        );
      })
        .orderBy("A", "ASC")
        .fetchPage({
          require: false,
          offset: (req.query.page - 1) * req.query.limit,
          limit: req.query.limit,
        });
      let count = await Server.query(function (qb) {
        qb.where("server_description", "in", serverDesc).andWhere(
          "active_status",
          "!=",
          constants.activeStatus.deleted
        );
      }).count();
      return res.success({ part_servers: serverFetch, count });
    }
    let normalizePart = await Server.query(function (qb) {
      qb.whereRaw(
        `id in (SELECT id from servers where "A" ILIKE '%${searchKey}%' OR 
          "B" ILIKE '%${searchKey}%' OR "C" ILIKE '%${searchKey}%' AND 
          server_description in ('${serverDesc}')  
          )`)
        .orWhere("A", "ilike", `%${searchKey}%`)
        .orWhere("B", "ilike", `%${searchKey}%`)
        .orWhere("C", "ilike", `%${searchKey}%`)
        .andWhere("server_description", "in", serverDesc)
        .andWhere("active_status", "!=", constants.activeStatus.deleted);
    })
      .orderBy("A", "ASC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
      });
    let count = await Server.query(function (qb) {
      qb.whereRaw(
        `id in (SELECT id from servers where "A" ILIKE '%${searchKey}%' OR 
        "B" ILIKE '%${searchKey}%' OR "C" ILIKE '%${searchKey}%' AND 
        server_description in ('${serverDesc}')  
        )`)
        .orWhere("A", "ilike", `%${searchKey}%`)
        .orWhere("B", "ilike", `%${searchKey}%`)
        .orWhere("C", "ilike", `%${searchKey}%`)
        .andWhere("server_description", "in", serverDesc)
        .andWhere("active_status", "!=", constants.activeStatus.deleted);
    }).count();
    if (!normalizePart)
      return res.serverError(
        404,
        ErrorHandler(constants.error.server.notFound)
      );

    return res.success({ part_servers: normalizePart, count });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
