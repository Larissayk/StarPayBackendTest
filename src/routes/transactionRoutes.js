const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController')

//POST
router.post("/", controller.postRequest);

module.exports = router;