const express = require('express');
const router = express.Router();

const showComponent = require('../../components/v1/config/show');

router.get('/',showComponent);

module.exports = router;
