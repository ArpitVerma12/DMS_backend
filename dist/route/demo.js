'use strict';

var express = require('express');

var _require = require('../controller/deno'),
    createDemo = _require.createDemo,
    viewDemo = _require.viewDemo;

var _require2 = require('../Middleware/d'),
    demoUpload = _require2.demoUpload;

var router = express.Router();

router.post('/create_demo', demoUpload, createDemo);
router.get('/view_demo', viewDemo);

module.exports = router;
//# sourceMappingURL=demo.js.map