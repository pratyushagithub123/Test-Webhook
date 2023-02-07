const csvtojson = require("csvtojson");
const Part = require("../../../models/part");
const fs = require("fs");
const { ErrorHandler } = require("../../../lib/utils");
const { constants } = require("../../../config");

module.exports = async (req, res, next) => {
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
          if (source[i]["_type"] == "Part") {
            const partNumber = source[i]["part_number"],
              type = source[i]["type"],
              partDescription = source[i]["part_description"],
              specification = source[i]["specification"],
              url = source[i]["url"],
              image = source[i]["image"] ? source[i]["image"] : null,
              country = source[i]["country"],
              category = source[i]["category"],
              subCategory = source[i]["sub_category"],
              productType = source[i]["product_type"],
              rohs = source[i]["RoHS"],
              breadCrumbs = source[i]["breadcrumb"] || source[i]["breadcrumbs"],
              productId = source[i]["product_id"],
              sku = source[i]["sku"],
              oem = source[i]["oem"],
              storeName = source[i]["store_name"]
                ? source[i]["store_name"]
                : req.body.store_name;
            if (storeName == "SuperMicro") {
              const splitHost = source[i]["host"].split(",");
              var serverDescription = splitHost[1]
                ? splitHost[1]
                : source[i]["host"];
            } else {
              var serverDescription =
                source[i]["host"] || source[i]["server_description"];
            }

            const partObject = {};
            if (partNumber) partObject["part_number"] = partNumber;
            if (type) partObject["type"] = type;
            if (partDescription)
              partObject["part_description"] = partDescription;
            if (serverDescription)
              partObject["server_description"] = serverDescription;
            if (specification) partObject["specification"] = specification;
            if (url) partObject["url"] = url;
            if (image) partObject["image"] = image;
            if (country) partObject["country"] = country;
            if (category) partObject["category"] = category;
            if (subCategory) partObject["sub_category"] = subCategory;
            if (productType) partObject["product_type"] = productType;
            if (rohs) partObject["RoHS"] = rohs;
            if (breadCrumbs) partObject["breadcrumbs"] = breadCrumbs;
            if (productId) partObject["product_id"] = productId;
            if (sku) partObject["sku"] = sku;
            if (oem) partObject["oem"] = oem;
            if (storeName) partObject["store_name"] = storeName;
            const part = await Part.where(partObject).fetch({
              require: false,
            });
            if (!part) {
              await Part.forge(partObject).save();
            } else {
              console.log(part.id, "Already have a part in DB");
            }
          } else if (!source[i]["_type"]) {
            const partNumber = source[i]["part_number"],
              type = source[i]["type"],
              partDescription = source[i]["part_description"],
              serverDescription = source[i]["server_description"],
              specification = source[i]["specification"],
              url = source[i]["url"],
              image = source[i]["image"] ? source[i]["image"] : null,
              country = source[i]["country"],
              category = source[i]["category"],
              subCategory = source[i]["sub_category"],
              productType = source[i]["product_type"],
              rohs = source[i]["RoHS"],
              breadCrumbs = source[i]["breadcrumb"] || source[i]["breadcrumbs"],
              productId = source[i]["product_id"],
              sku = source[i]["sku"],
              oem = source[i]["oem"],
              storeName = source[i]["store_name"]
                ? source[i]["store_name"]
                : req.body.store_name;

            const partObject = {};
            if (partNumber) partObject["part_number"] = partNumber;
            if (type) partObject["type"] = type;
            if (partDescription)
              partObject["part_description"] = partDescription;
            if (serverDescription)
              partObject["server_description"] = serverDescription;
            if (specification) partObject["specification"] = specification;
            if (url) partObject["url"] = url;
            if (image) partObject["image"] = image;
            if (country) partObject["country"] = country;
            if (category) partObject["category"] = category;
            if (subCategory) partObject["sub_category"] = subCategory;
            if (productType) partObject["product_type"] = productType;
            if (rohs) partObject["RoHS"] = rohs;
            if (breadCrumbs) partObject["breadcrumbs"] = breadCrumbs;
            if (productId) partObject["product_id"] = productId;
            if (sku) partObject["sku"] = sku;
            if (oem) partObject["oem"] = oem;
            if (storeName) partObject["store_name"] = storeName;

            const part = await Part.where(partObject).fetch({
              require: false,
            });
            if (!part) {
              await Part.forge(partObject).save();
            } else {
              console.log(part.id, "Already have a part in DB");
            }
          }
        }
        const dir = fs.unlink(file, (error, callback) => {
          if (error) console.log("error", error);
        });
      });
    return res.status(200).send({ message: "Successfully inserted" });
  } catch (e) {
    res.status(500).send(e);
  }
};
