const csvtojson = require("csvtojson");
const Server = require("../../../models/server");
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
            const name = source[i]["name"] ? source[i]["name"] :"",              
              sku = source[i]["sku"] ? source[i]["sku"] : "",
              serverDescription =source[i]["host"] || source[i]["server_description"] ? source[i]["host"] || source[i]["server_description"] :"",
              pageTitle = source[i]["page_title"] ? source[i]["page_title"] : "",
              breadcrumbs = source[i]["breadcrumbs"] ? source[i]["breadcrumbs"] :"",
              url = source[i]["url"] ?  source[i]["url"] : "",
              image = source[i]["image"] ? source[i]["image"] :"",
              motherboard = source[i]["motherboard"] ? source[i]["motherboard"] : "",
              specification = source[i]["specification"] ? source[i]["specification"] : {} ,
              storeName =  source[i]["store_name"]? source[i]["store_name"] : req.body.store_name,             
              series =  source[i]["series"] ?  source[i]["series"] : "",
              formatted_specs = source[i]['formatted_specs'] ? source[i]["formatted_specs"] : {} ,
              A = source[i]["A"] ? source[i]['A'] : "",
              B = source[i]["B"] ? source[i]['B'] : "",
              C = source[i]["C"] ? source[i]['C'] : "" ;

              if(serverDescription){                        
                const serverObject = {
                  name: name,              
                  sku: sku,
                  server_description: serverDescription,
                  page_title: pageTitle,
                  breadcrumbs: breadcrumbs,
                  url: url,
                  image: image,
                  motherboard: motherboard,
                  specification: specification,
                  store_name: storeName,
                  series:series,
                  formatted_specs: formatted_specs,
                  A: A,
                  B: B,
                  C: C
                };
                const server = await Server.where({ server_description: serverDescription, store_name : storeName}).fetch({ require: false, columns: ['id']});               
                if (!server) {
                  await Server.forge(serverObject).save();
                }else{
                  await Server.forge({ id: server.id }).save(serverObject);
                }
              }  
          }
          else if(!source[i]["_type"]) {
              const name = source[i]["name"] ? source[i]["name"] :"",              
                  sku = source[i]["sku"] ? source[i]["sku"] : "",
                  serverDescription = source[i]["host"] || source[i]["QueriedDescription"] || source[i]["server_description"] ? source[i]["host"] || source[i]["QueriedDescription"] || source[i]["server_description"] :"",
                  pageTitle = source[i]["page_title"] ? source[i]["page_title"] : "",
                  breadcrumbs = source[i]["breadcrumbs"] ? source[i]["breadcrumbs"] :"",
                  url = source[i]["url"] ?  source[i]["url"] : "",
                  image = source[i]["image"] ? source[i]["image"] :"",
                  motherboard = source[i]["motherboard"] ? source[i]["motherboard"] : "",
                  specification = source[i]["specification"] ? source[i]["specification"] : {} ,                              
                  storeName =  source[i]["store_name"]? source[i]["store_name"] : req.body.store_name,
                  series =  source[i]["series"] ?  source[i]["series"] : "",
                  formatted_specs = source[i]['formatted_specs'] ? source[i]["formatted_specs"] : {} ,
                  A = source[i]["A"] ? source[i]['A'] : "",
                  B = source[i]["B"] ? source[i]['B'] : "",
                  C = source[i]["C"] ? source[i]['C'] : "" ;

                if(serverDescription){             
                  const serverObject = {
                    name: name,              
                    sku: sku,
                    server_description: serverDescription,
                    page_title: pageTitle,
                    breadcrumbs: breadcrumbs,
                    url: url,
                    image: image,
                    motherboard: motherboard,
                    specification: specification,
                    store_name: storeName,
                    series:series,
                    formatted_specs: formatted_specs,
                    A: A,
                    B: B,
                    C: C  
                  };                 
                  const server = await Server.where({ server_description: serverDescription, store_name : storeName}).fetch({ require: false, columns: ['id']});                  
                  if (!server) {
                    await Server.forge(serverObject).save();
                  }else{
                    await Server.forge({ id: server.id }).save(serverObject);
                  }
                } 
          }         
        }
        console.log(file,"file path for unlink")
        const dir = fs.unlink(file, (error, callback) => {
          if (error) console.log("error", error);
        });
      });
    return res.status(200).send({ message: "Successfully inserted" });
  } catch (e) {
    res.status(500).send(e);
  }
};