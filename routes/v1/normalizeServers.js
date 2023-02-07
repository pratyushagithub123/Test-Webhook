const express = require('express');
const router = express.Router();

const getSearchSpecification = require("../../components/v1/normalize_server/searchSpecification");
const getNormalizeServerCompatibility = require("../../components/v1/normalize_server/getServerDetails");
const fetchABCComponents = require("../../components/v1/normalize_server/fetchGroupbyABC");

router.post('/fetchspecs', getSearchSpecification);
router.get('/fetchserver',getNormalizeServerCompatibility);
router.get('/:ABC', fetchABCComponents);

module.exports = router;