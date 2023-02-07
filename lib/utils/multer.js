const multer = require("multer");
const path = require("path");
const { constants } = require("../../config");

const csvFilter = (req, file, cb) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".csv") {
    req.fileValidationError = constants.error.multer.invalidFile;
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let reqPath = path.join(__dirname, "../../uploads");
    cb(null, reqPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.basename(file.originalname));
  },
});

const upload = multer({ storage: storage, fileFilter: csvFilter });

module.exports = upload;
