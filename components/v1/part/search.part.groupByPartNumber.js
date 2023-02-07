"use strict";
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");
const Part = require("../../../models/part");
const knex = require('../../../config/knex.config').knex;
module.exports = async (req, res) => {
  try {
    const part_number = req.params.part_number;
    if (!part_number)
      return res.serverError(404,ErrorHandler(constants.error.part.partNumberRequired));
    // for get part group By part_number part_description store_name
    let parts =  await knex('parts')
                      .select('part_number','part_description','store_name','server_description')
                      .count('* as part_number_count')
                      .where("part_number", "ilike", `%${part_number}%`) 
                      .andWhere("active_status", "!=", constants.activeStatus.deleted) 
                      .orWhere("store_name", "ilike", `%${part_number}%`)
                      .orderBy('part_number','asc')  
                      .groupBy('part_number','part_description','store_name','server_description')                      
                      .offset((req.query.page - 1) * req.query.limit)
                      .limit(req.query.limit);     
    // for count group By part Number
    let partsC = await knex('parts')
                      .select('part_number','part_description','store_name', 'server_description')                                
                      .where("part_number", "ilike", `%${part_number}%`) 
                      .andWhere("active_status", "!=", constants.activeStatus.deleted) 
                      .orWhere("store_name", "ilike", `%${part_number}%`)
                      .groupBy('part_number','part_description','store_name','server_description')    
    
    return res.success({ parts, count: partsC.length });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
