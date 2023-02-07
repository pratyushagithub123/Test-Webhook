'use strict';
const { ErrorHandler,LogHelper } = require('../../../lib/utils');
const { constants } = require('../../../config');
const Server = require("../../../models/server");
const Part = require("../../../models/part");

module.exports = async (req, res) => {
  try {
    const partNumber = req.params.part_number; 
    const StoreName = req.params.store_name;
    const partDescription = req.params.part_description;
    const serverDescription = req.params.server_description;

    if(!partNumber)
    return res.serverError(404, ErrorHandler(constants.error.part.partNumberRequired));
            
    
    let parts = await Part.where({part_number:partNumber})
            .fetchAll({require: false ,
                columns: [                          
                    "id",
                    "part_number",
                    "part_description",
                    "type",
                    "store_name",
                    "breadcrumbs",
                    "server_description",
                    "image",
                    "url",
                    "active_status",
                    "specification"
                ]  
            }); 
    if(parts.length ===0)
      return res.serverError(404, ErrorHandler(constants.error.part.notFound));
      
    var serverDescriptions = parts.toJSON().map(part => part.server_description);  
    let part_servers = await Server.query(function (qb) {
          qb.where('server_description', 'in', serverDescriptions)
            .andWhere('active_status', '!=', constants.activeStatus.deleted) 
        })
        .orderBy('created_at', 'DESC')
        .fetchPage({
            require: false,
            offset: (req.query.page - 1) * req.query.limit,
            limit: req.query.limit                                  
        });   
    const partByStoreName = parts
      .toJSON()
      .filter(
        (part) =>
          part.store_name === StoreName &&
          part.part_description == partDescription &&
          part.server_description == serverDescription != 0 ? serverDescription : 'null'
      );  
    let  part = Object.assign(partByStoreName[0],{ part_servers: part_servers.toJSON()});
    // for count
    let count = await Server.query(function (qb) {
                                qb.where('server_description', 'in', serverDescriptions)
                                .andWhere('active_status', '!=', constants.activeStatus.deleted)
                                .orderBy('created_at', 'DESC') 
                            }).fetchAll({require: false });  
     
    return res.success({ part:part, count: count.length });

  } catch (error) {
      return res.serverError(500, ErrorHandler(error));
  }
};