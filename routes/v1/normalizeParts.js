const express = require("express");
const router = express.Router();

const getNormalizePartCompatibility = require("../../components/v1/normalize_part/getPartDetails");
const getSearchABC = require("../../components/v1/normalize_part/searchABC");
const fetchPartComponents = require("../../components/v1/normalize_part/fetchPartsGroupby");

router.get("/getnormalizepart/:id", getNormalizePartCompatibility);
router.post("/fetchABC", getSearchABC);
router.get("/:parts", fetchPartComponents);

module.exports = router;
