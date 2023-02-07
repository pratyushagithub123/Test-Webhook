'use strict';
const { ErrorHandler,LogHelper } = require('../../../lib/utils');
const { constants } = require('../../../config');
const Server = require("../../../models/server");
const Part = require("../../../models/part");
const ServerParts = require("../../../models/server.part.compatibilities");

module.exports = async (req, res) => {
  try {
    const serverID = req.params.id; 
    if(isNaN(serverID))
      return res.serverError(404, ErrorHandler(constants.error.server.serverIdInteger));

      const serverRes = await Server.where({ id: serverID }).fetch({
        require: false,
      });
      if (!serverRes)
        return res.serverError(
          404,
          ErrorHandler(constants.error.server.notFound)
        );
      let where ={};
      if(serverRes.attributes.A =="" && serverRes.attributes.B =="" &&serverRes.attributes.C==""){
        where ={
          id:serverID
        }
      }else{
        where ={
          A: serverRes.attributes.A,
          B: serverRes.attributes.B,
          C: serverRes.attributes.C,
        }
      }      
      const serversABC = await Server.where(where).fetchAll({ require: false });
      const serverIdsMatch = serversABC.toJSON().map((server) => server.id);

      let servers = await ServerParts.query(function (qb) {
        qb.where("server_id", "in", serverIdsMatch);
      })
        .orderBy("created_at", "DESC")
        .fetchPage({
          require: false,
          offset: (req.query.page - 1) * req.query.limit,
          limit: req.query.limit,
        });
    // check from server part compatibility
    // if(servers.length == 0)
    //   return res.serverError(404, ErrorHandler(constants.error.serverparts.serverpartsNotFound));
          
    var partIds = servers.toJSON().map(serverpart => serverpart.part_id);
    LogHelper.log('objecterror',partIds);
    let server = await Server.where({id:serverID}).fetch({require: false }); 
    if(!server)
      return res.serverError(404, ErrorHandler(constants.error.server.notFound));
   
    let server_parts = await Part.query(function (qb) {
          qb.where('id', 'in', partIds)
            .andWhere('active_status', '!=', constants.activeStatus.deleted) 
        })
        .orderBy('created_at', 'DESC')
        .fetchAll({require: false });
            
    server = Object.assign( server.toJSON(),{ server_parts: server_parts.toJSON() });
    let count = await ServerParts.query(function (qb) {
      qb.where("server_id", "in", serverIdsMatch);
    }).count();
    return res.success({ server:server, count: Number(count) });  

    } catch (error) {
      return res.serverError(500, ErrorHandler(error));
    }
};
