const express = require('express');
const router = express.Router();

const createPart = require('../../components/v1/part/addPart');
const searchPartComponents = require('../../components/v1/part/search.part');
const fetchPartComponents = require('../../components/v1/part/fetch.part');
const upload = require('../../lib/utils/multer');
const partsGroupByPartNumberComponents = require('../../components/v1/part/search.part.groupByPartNumber');

router.post('/', upload.single('file'), createPart);
router.get('/search',searchPartComponents);
router.get('/:id', fetchPartComponents);
router.get('/search/:part_number',partsGroupByPartNumberComponents);
module.exports = router;
