const express = require('express')


const { createDemo, viewDemo } = require('../controller/deno')
const { demoUpload } = require('../Middleware/d')
const router = express.Router()


router.post('/create_demo',demoUpload, createDemo)
router.get('/view_demo',viewDemo)

module.exports = router