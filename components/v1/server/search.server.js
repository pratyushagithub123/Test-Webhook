'use strict';
const { ErrorHandler } = require('../../../lib/utils');
const { constants } = require('../../../config');
const Server = require("../../../models/server");

module.exports = async (req, res) => {
  try {
    const search_keyword = req.query.search;
    if(!search_keyword)
      return res.serverError(404, ErrorHandler(constants.error.server.searchKeywordRequired));

    
    let servers = await Server.query(function (qb) {
                qb.where('server_description', 'ilike',  `%${search_keyword}%`)
                .andWhere('active_status', '!=', constants.activeStatus.deleted)
                .orWhere("store_name", "ilike", `%${search_keyword}%`)                
            })
            .orderBy('created_at', 'DESC').fetchPage({require: false ,
                offset: (req.query.page - 1) * req.query.limit,
                limit: req.query.limit ,
                columns: ['id','name', 'sku','server_description','store_name','url','image','A','B','C']
            }); 
            let count = await Server.query(function (qb) {
                    qb.where('server_description', 'ilike',  `%${search_keyword}%`)
                    .andWhere('active_status', '!=', constants.activeStatus.deleted)
                    .orWhere("store_name", "ilike", `%${search_keyword}%`)              
                }).count(); 
    
    return res.success({ servers,count: Number(count) });  

    } catch (error) {
      return res.serverError(500, ErrorHandler(error));
    }
};
