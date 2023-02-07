const express = require('express');
const router = express.Router();

const createServerPartsCompatibility = require('../../components/v1/server_part_compatibility/server.parts.compatibility');
const getServerPartsCompatibility = require('../../components/v1/server_part_compatibility/get.server.parts.compatibility');
const getPartServersCompatibility = require('../../components/v1/server_part_compatibility/get.part.servers.compatibility');
const searchServerPartsComponents = require('../../components/v1/server_part_compatibility/search.all');
const upload = require('../../lib/utils/multer');

router.post('/', upload.single('file'), createServerPartsCompatibility);
router.get('/getserverparts/:id',getServerPartsCompatibility);
router.get('/getpartservers/:part_number/:store_name/:part_description/:server_description',getPartServersCompatibility);
router.get('/search',searchServerPartsComponents);

module.exports = router;
