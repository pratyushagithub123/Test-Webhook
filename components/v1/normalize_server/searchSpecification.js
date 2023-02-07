const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const serverDescription = req.body.server_description;
    const searchKey = req.body.search_keyword.trim();
    if (!searchKey) {
      let partFetch = await Part.query(function (qb) {
        qb.where("server_description", "in", serverDescription).andWhere(
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
        let count = await Part.query(function (qb) {
          qb.where("server_description", "in", serverDescription).andWhere(
            "active_status",
            "!=",
            constants.activeStatus.deleted
          );
        }).count();
      return res.success({ server_parts: partFetch, count });
    };
    let normalizePart = await Part.query(function (qb) {
      qb.whereRaw(
        `id in (select id from parts ,jsonb_each_text(parts.specification) where value ilike '%${searchKey}%' AND server_description in (${serverDescription
          .map((code) => `'${code}'`)
          .join(", ")}) group by id)`
      ).orWhere("part_number", "ilike", `%${searchKey}%`)
      .andWhere("server_description", "in", serverDescription)
      .andWhere("active_status", "!=", constants.activeStatus.deleted);
    })
      .orderBy("created_at", "DESC")
      .fetchPage({
        require: false,
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
      });
      let count = await Part.query(function (qb) {
        qb.whereRaw(
          `id in (select id from parts ,jsonb_each_text(parts.specification) where value ilike '%${searchKey}%' AND server_description in (${serverDescription
            .map((code) => `'${code}'`)
            .join(", ")}) group by id)`
        ).orWhere("part_number", "ilike", `%${searchKey}%`)
        .andWhere("server_description", "in", serverDescription)
        .andWhere("active_status", "!=", constants.activeStatus.deleted);
      }).count();
    if (!normalizePart)
      return res.serverError(
        404,
        ErrorHandler(constants.error.server.notFound)
      );

    return res.success({ server_parts: normalizePart, count });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
