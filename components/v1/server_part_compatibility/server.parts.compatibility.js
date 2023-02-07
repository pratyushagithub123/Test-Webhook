const csvtojson = require("csvtojson");
const Server = require("../../../models/server");
const Part = require("../../../models/part");
const ServerParts = require("../../../models/server.part.compatibilities");
const fs = require("fs");
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");

module.exports = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.serverError(400, ErrorHandler(req.fileValidationError));
    }
    if (!req.file.path) {
      return res.serverError(400, ErrorHandler(constants.error.multer.invalidFile));
    }

    const file = req.file.path;
    csvtojson()
      .fromFile(file)
      .then(async (source) => {
        for (var i = 0; i < source.length; i++) {
          if (source[i]["_type"] == "Host") {
            const server_description = source[i]["host"] || source[i]["QueriedDescription"] || source[i]["server_description"] ? source[i]["host"] || source[i]["QueriedDescription"] || source[i]["server_description"] :"";               
            
            if(server_description){           
              const serverID = await Server.where({ server_description: server_description }).fetch({ require: false, columns: ['id']});                         
              const partIds = await Part.where({ server_description: server_description }).fetchAll({ require: false, columns: ['id']});                
              if(partIds.length && serverID){
                const serverParts = []
                partIds.forEach(async item => {                  
                  const obj = { part_id: item.id, server_id: serverID.id }
                  const serverPartsID = await ServerParts.where(obj).fetch({ require: false, columns: ['id']});                  
                  if(!serverPartsID){                    
                    await ServerParts.forge(obj).save();                    
                  }else{
                    console.log(serverPartsID.id,"Record have in DB");
                  }
                }) 
              }
            }
          } 
          else if(!source[i]["_type"]){            
            const server_description = source[i]["host"] || source[i]["QueriedDescription"] || source[i]["server_description"] ? source[i]["host"] || source[i]["QueriedDescription"] || source[i]["server_description"] :"";               
            if(server_description){           
              const serverID = await Server.where({ server_description: server_description }).fetch({ require: false, columns: ['id']});                          
              const partIds = await Part.where({ server_description: server_description }).fetchAll({ require: false, columns: ['id']});              
              if(partIds.length && serverID){
                const serverParts = []
                partIds.forEach(async item => {                  
                  const obj = { part_id: item.id, server_id: serverID.id }
                  const serverPartsID = await ServerParts.where(obj).fetch({ require: false, columns: ['id']});                  
                  if(!serverPartsID){                    
                    await ServerParts.forge(obj).save();                    
                  }else{
                    console.log(serverPartsID.id,"Record have in DB");
                  }
                }) 
              }
            }  
          }
        } //end for  
        const dir = fs.unlink(file, (error, callback) => {
          if (error) console.log("error", error);
        });
      });
    return res.status(200).send({ message: "Successfully inserted" });
  } catch (e) {
    res.status(500).send(e);
  }
};
