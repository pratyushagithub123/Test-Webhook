const express = require('express');
const router = express.Router();
const createServer = require('../../components/v1/server/addServer');
const searchServerComponents = require('../../components/v1/server/search.server');
const upload = require('../../lib/utils/multer');

router.post('/', upload.single('file'), createServer);
router.get('/search',searchServerComponents);


module.exports = router;
